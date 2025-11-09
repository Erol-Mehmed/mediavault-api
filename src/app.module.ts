import { Module } from '@nestjs/common';
import { MediaModule } from './media/media.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MediaModule,
  ],
})
export class AppModule {}
