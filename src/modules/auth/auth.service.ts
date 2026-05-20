import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from './refresh-tokens.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(data: LoginDto) {
    const user = await this.usersService.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('JWT_EXPIRES_IN'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'JWT_REFRESH_EXPIRES_IN',
      ),
    });

    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await this.refreshTokensRepository.create({
      user_id: user.id,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: 900,
      token_type: 'Bearer',
    };
  }
}
