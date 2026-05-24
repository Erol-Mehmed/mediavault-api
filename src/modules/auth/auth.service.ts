import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { RefreshToken } from './types/refresh-token.type';

interface JwtPayload {
  sub: string;
  email: string;
}

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

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.configService.getOrThrow<string>(
        'jwt.refreshExpiresIn',
      ) as never,
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
      expires_in: '15m',
      token_type: 'Bearer',
    };
  }

  private async validateRefreshToken(refreshToken: string): Promise<{
    payload: JwtPayload;
    token: RefreshToken;
  }> {
    const payload = this.jwtService.verify<JwtPayload>(refreshToken, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
    });

    const activeTokens = await this.refreshTokensRepository.findByUserId(
      payload.sub,
    );

    let matchedToken: RefreshToken | null = null;

    for (const token of activeTokens) {
      const matches = await bcrypt.compare(refreshToken, token.token_hash);

      if (matches) {
        matchedToken = token;
        break;
      }
    }

    if (!matchedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      payload,
      token: matchedToken,
    };
  }

  async logout(refreshToken: string) {
    const { token } = await this.validateRefreshToken(refreshToken);
    await this.refreshTokensRepository.revoke(token.id!);
  }

  async refresh(refreshToken: string) {
    const { payload, token } = await this.validateRefreshToken(refreshToken);
    await this.refreshTokensRepository.revoke(token.id!);

    const newPayload: JwtPayload = {
      sub: payload.sub,
      email: payload.email,
    };

    const accessToken = this.jwtService.sign(newPayload);

    const newRefreshToken = this.jwtService.sign(newPayload, {
      secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
      expiresIn: this.configService.getOrThrow<string>(
        'jwt.refreshExpiresIn',
      ) as never,
    });

    const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

    await this.refreshTokensRepository.create({
      user_id: payload.sub,
      token_hash: refreshTokenHash,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });

    return {
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: '15m',
      token_type: 'Bearer',
    };
  }
}
