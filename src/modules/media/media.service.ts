import { Injectable } from '@nestjs/common';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  getAll(userId: string) {
    return this.mediaRepository.getAll(userId);
  }
}
