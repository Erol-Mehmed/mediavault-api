import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() data: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(data);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: 'auth/refresh',
    });

    return result.response;
  }

  @Post('refresh')
  refresh(data: RefreshTokenDto) {
    return this.authService.refresh(data.refresh_token);
  }

  @Post('logout')
  logout(data: RefreshTokenDto) {
    return this.authService.logout(data.refresh_token);
  }
}
