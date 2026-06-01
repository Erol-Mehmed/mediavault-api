import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { createAuthMocks } from '../../test/helpers/auth-mocks.helper';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mocks: ReturnType<typeof createAuthMocks>;

  beforeEach(async () => {
    mocks = createAuthMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mocks.usersService,
        },
        {
          provide: RefreshTokensRepository,
          useValue: mocks.refreshTokensRepository,
        },
        {
          provide: JwtService,
          useValue: mocks.jwtService,
        },
        {
          provide: ConfigService,
          useValue: mocks.configService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    // Login successfully
    it('should login successfully', async () => {
      mocks.usersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mocks.jwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      mocks.refreshTokensRepository.create.mockResolvedValue({});

      mocks.configService.getOrThrow.mockReturnValue('15m');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toBeDefined();
      expect(result.access_token).toBe('access-token');
      expect(result.refresh_token).toBe('refresh-token');
    });

    // Login failure - email
    it('should throw if email does not exist', async () => {
      mocks.usersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'missing@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid email or password');
    });

    // Login failure - password
    it('should throw if password is invalid', async () => {
      mocks.usersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrong-password',
        }),
      ).rejects.toThrow('Invalid email or password');
    });
  });

  // ---------------- LOGOUT ----------------
  describe('logout', () => {
    // Logout success
    it('should logout successfully', async () => {
      mocks.jwtService.verify.mockReturnValue({
        sub: 'user-1',
        email: 'test@example.com',
      });

      mocks.refreshTokensRepository.findByUserId.mockResolvedValue([
        {
          id: 'token-1',
          user_id: 'user-1',
          token_hash: 'hashed-token',
          revoked: false,
        },
      ]);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mocks.refreshTokensRepository.revoke.mockResolvedValue(true);

      await service.logout('refresh-token');

      expect(mocks.refreshTokensRepository.findByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(mocks.refreshTokensRepository.revoke).toHaveBeenCalledWith(
        'token-1',
      );
    });
  });
});
