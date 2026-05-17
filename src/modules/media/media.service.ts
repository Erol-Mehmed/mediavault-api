import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MediaRepository } from './media.repository';
import { CreateMediaDto } from './dto/create-media.dto';
import { CreateMediaData } from './types/create-media-data.type';
import { UpdateMediaDto } from './dto/update-media.dto';
import { UpdateMediaData } from './types/update-media-data.type';
import { cleanUpdate } from '../../common/utils/clean-update-util';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async create(userId: string, dto: CreateMediaDto) {
    const mediaData: CreateMediaData = {
      user_id: userId,

      media_type: dto.media_type,

      external_id: dto.external_id,
      external_source: dto.external_source,

      title: dto.title,

      description: dto.description,
      release_date: dto.release_date,

      poster_url: dto.poster_url,
      backdrop_url: dto.backdrop_url,

      genres: dto.genres,

      rating: dto.rating,

      runtime: dto.runtime,
      total_episodes: dto.total_episodes,

      authors: dto.authors,
      platforms: dto.platforms,
    };

    return this.mediaRepository.create(mediaData);
  }

  update(userId: string, id: string, dto: UpdateMediaDto) {
    const updateData: UpdateMediaData = cleanUpdate(dto);

    if (!Object.keys(updateData).length) {
      throw BadRequestException;
    }

    return this.mediaRepository.update(userId, id, updateData);
  }

  getAll(userId: string) {
    return this.mediaRepository.getAll(userId);
  }

  async getOne(userId: string, id: string) {
    const media = await this.mediaRepository.getOne(userId, id);

    if (!media) {
      throw new NotFoundException('Media not found');
    }

    return media;
  }
}
