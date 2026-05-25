import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  imports: [
    UsersModule,
    DatabaseModule,

    PassportModule.register({
      defaultStrategy: 'jwt',
    }),

    JwtModule.registerAsync({
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwt.secret'),

        signOptions: {
          expiresIn: configService.getOrThrow('jwt.expiresIn'),
          issuer: configService.getOrThrow<string>('jwt.issuer'),
          audience: configService.getOrThrow<string>('jwt.audience'),
        },
      }),
    }),
  ],

  providers: [AuthService, JwtStrategy, RefreshTokensRepository],
  controllers: [AuthController],
})
export class AuthModule {}
