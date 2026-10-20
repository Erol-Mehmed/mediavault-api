import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  const authServiceMock = {
    login: jest.fn(),
  };
  const cookieMock = jest.fn();
  const responseMock = {
    cookie: cookieMock,
  } as unknown as Response;

  beforeEach(async () => {
    jest.clearAllMocks();

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
        expires_in: '15m',
        token_type: 'Bearer',
      };

      authServiceMock.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto, responseMock);

      expect(authServiceMock.login).toHaveBeenCalledWith(loginDto);
      expect(cookieMock).toHaveBeenCalledWith(
        'refresh_token',
        'refresh-token',
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        },
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate login errors', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'wrong-password',
      };

      const error = new UnauthorizedException('Invalid credentials');

      authServiceMock.login.mockRejectedValue(error);

      await expect(controller.login(loginDto, responseMock)).rejects.toThrow(
        error,
      );

      expect(cookieMock).not.toHaveBeenCalled();
    });
  });
});
