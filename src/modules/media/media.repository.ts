import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Media } from './media.model';

@Injectable()
export class MediaRepository {

  async findAllMedia(): Promise<Media[]> {
    const result = await this.db.query<Media>('SELECT * FROM media');
    return result.rows;
  }
}
