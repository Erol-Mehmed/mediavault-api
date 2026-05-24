import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
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
