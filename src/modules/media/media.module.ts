import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { MediaRepository } from './media.repository';
import { DatabaseModule } from '../../common/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [MediaService, MediaRepository],
  controllers: [MediaController],
})
export class MediaModule {}
