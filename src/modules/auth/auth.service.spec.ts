import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn(),
  };

  const mockRefreshTokensRepository = {
    create: jest.fn(),
    findByUserId: jest.fn(),
    revoke: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: RefreshTokensRepository,
          useValue: mockRefreshTokensRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  // Service existence
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // -------------------------
  // LOGIN GROUP
  // -------------------------
  describe('login', () => {
    // Login successfully
    it('should login successfully', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        password: 'hashed-password',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockJwtService.sign
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');

      mockRefreshTokensRepository.create.mockResolvedValue({});

      mockConfigService.getOrThrow.mockReturnValue('15m');

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
      mockUsersService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'missing@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow('Invalid email or password');
    });

    // Login failure - password
    it('should throw if password is invalid', async () => {
      mockUsersService.findByEmail.mockResolvedValue({
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

  // -------------------------
  // LOGOUT GROUP
  // -------------------------
  describe('logout', () => {
    // Logout success
    it('should logout successfully', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'user-1',
        email: 'test@example.com',
      });

      mockRefreshTokensRepository.findByUserId.mockResolvedValue([
        {
          id: 'token-1',
          user_id: 'user-1',
          token_hash: 'hashed-token',
          revoked: false,
        },
      ]);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      mockRefreshTokensRepository.revoke.mockResolvedValue(true);

      await service.logout('refresh-token');

      expect(mockRefreshTokensRepository.findByUserId).toHaveBeenCalledWith(
        'user-1',
      );
      expect(mockRefreshTokensRepository.revoke).toHaveBeenCalledWith(
        'token-1',
      );
    });
  });
});
