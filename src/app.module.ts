import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: config }),
    MediaModule,
  ],
})
export class AppModule {}
