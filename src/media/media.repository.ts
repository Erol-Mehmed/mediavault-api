import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export type Media = Record<string, unknown>;

@Injectable()
export class MediaRepository {
  constructor(@Inject('PG_CONNECTION') private db: Pool) {}

  async findAllMedia(): Promise<Media[]> {
    const result = await this.db.query<Media>('SELECT * FROM media');
    return result.rows;
  }
}
