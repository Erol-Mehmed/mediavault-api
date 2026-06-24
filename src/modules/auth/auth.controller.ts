import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';

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
      path: '/',
    });

    return result;
  }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    res.clearCookie('refresh_token', {
      path: '/auth/refresh',
    });

    return this.authService.logout(refreshToken);
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const result = await this.authService.refresh(refreshToken);

    res.cookie('refresh_token', result.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    return {
      access_token: result.access_token,
      expires_in: result.expires_in,
      token_type: result.token_type,
      user: result.user,
    };
  }

  @Get('me')
  me(@Req() req: Request) {
    const refreshToken = req.cookies?.refresh_token as string | undefined;
    return this.authService.me(refreshToken);
  }
}
