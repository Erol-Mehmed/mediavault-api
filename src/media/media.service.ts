import { Injectable } from '@nestjs/common';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepo: MediaRepository) {}

  getAllMedia() {
    return this.mediaRepo.findAllMedia();
  }
}
