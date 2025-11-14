import { Module } from '@nestjs/common';
import { MediaModule } from './modules/media/media.module';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    MediaModule,
  ],
})
export class AppModule {}
