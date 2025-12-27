import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    MediaModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
