import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from './repositories/refresh-tokens.repository';
import { RefreshToken } from './types/refresh-token.type';
import { JwtPayload } from './types/jwt-payload.type';
import ms, { StringValue } from 'ms';
import User from '../users/users.model';
import { PasswordResetRepository } from './repositories/password-reset.repository';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { createHash, randomBytes } from 'node:crypto';
import { EmailService } from '../../common/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersRepository } from '../users/users.repository';
import { KnexService } from '../../common/database/knex.service';
import { Knex } from 'knex';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly refreshTokensRepository: RefreshTokensRepository,
    private readonly passwordResetRepository: PasswordResetRepository,
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly knexService: KnexService,
  ) {}

  // Helpers-----------------------------------------------------------------------------

  private getExpiresAt(): string {
    const refreshExpiresIn = this.configService.getOrThrow<StringValue>(
      'jwt.refreshExpiresIn',
    );

    const refreshExpiresMs = ms(refreshExpiresIn);

    if (refreshExpiresMs === undefined) {
      throw new Error('Invalid refresh token expiration');
    }

    return new Date(Date.now() + refreshExpiresMs).toISOString();
  }

  private getPasswordResetExpiresAt(): string {
    return new Date(Date.now() + 15 * 60 * 1000).toISOString();
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

  private async getUser(email: string): Promise<User> {
    return await this.usersService.findByEmail(email);
  }

  private createTokenHash(token: string) {
    return createHash('sha256').update(token).digest('hex');
  }

  // -----------------------------------------------------------------------------------------

  async login(data: LoginDto) {
    const user = await this.getUser(data.email);

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
      expires_at: this.getExpiresAt(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: '15m',
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        is_premium: user.is_premium,
      },
    };
  }

  async logout(refreshToken: string) {
    const { token } = await this.validateRefreshToken(refreshToken);
    await this.refreshTokensRepository.revoke(token.id!);
  }

  async refresh(refreshToken: string) {
    const { payload, token } = await this.validateRefreshToken(refreshToken);
    const user = await this.getUser(payload.email);
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
      expires_at: this.getExpiresAt(),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      expires_in: '15m',
      token_type: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        is_premium: user.is_premium,
      },
    };
  }

  async me(refreshToken?: string) {
    if (!refreshToken) {
      return {
        authenticated: false,
        user: null,
      };
    }

    try {
      const { payload } = await this.validateRefreshToken(refreshToken);
      const user = await this.getUser(payload.email);

      return {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          is_premium: user.is_premium,
        },
      };
    } catch {
      return {
        authenticated: false,
        user: null,
      };
    }
  }

  async forgotPassword(data: ForgotPasswordDto) {
    const user = await this.getUser(data.email);
    const messagedReturn = () => {
      return {
        message:
          'If an account exists with this email, you will receive password reset instructions.',
      };
    };

    if (!user) {
      return messagedReturn();
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.createTokenHash(token);

    await this.passwordResetRepository.invalidateActiveByUserId(user.id);
    await this.passwordResetRepository.create({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: this.getPasswordResetExpiresAt(),
    });

    const resetUrl = `http://localhost:3000/reset-password?token=${token}`;

    await this.emailService.sendEmail(
      user.email,
      'MediaVault - Password Reset',
      `You requested a password reset. Open this link to reset your password: ${resetUrl}`,
      `
        <h2>Password Reset</h2>
        <p>You requested a password reset for your MediaVault account.</p>
        <p>
          <a href="${resetUrl}">Reset your password</a>
        </p>
        <p>This link expires in 15 minutes.</p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    );

    return messagedReturn();
  }

  async resetPassword(data: ResetPasswordDto) {
    const tokenHash = this.createTokenHash(data.token);

    await this.knexService.knex.transaction(async (trx: Knex.Transaction) => {
      const token = await this.passwordResetRepository.consumeValidToken(
        tokenHash,
        trx,
      );

      if (!token) {
        throw new UnauthorizedException(
          'Invalid or expired password reset token',
        );
      }

      const newHashedPassword = await bcrypt.hash(data.password, 10);

      await this.usersRepository.updatePassword(
        token.user_id,
        newHashedPassword,
        trx,
      );

      await this.refreshTokensRepository.revokeByUserId(token.user_id, trx);
    });

    return {
      message: 'Password has been reset successfully.',
    };
  }
}
