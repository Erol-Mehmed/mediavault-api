import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    login: jest.fn(),
  };
  const responseMock: Pick<Response, 'cookie'> = {
    cookie: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ---------------- LOGIN ----------------
  describe('login', () => {
    it('should login and set the refresh token cookie', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const expectedResult = {
        access_token: 'access-token',
        refresh_token: 'refresh-token',
        expires_in: 900,
        token_type: 'Bearer',
      };

      authServiceMock.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto, responseMock);

      expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });
});
