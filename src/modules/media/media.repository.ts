import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

export type Media = {
  id: string;
  title: string;
  type: string;
  releaseYear: string;
};

@Injectable()
export class MediaRepository {
  constructor(@Inject('PG_CONNECTION') private db: Pool) {}

  async findAllMedia(): Promise<Media[]> {
    const result = await this.db.query<Media>('SELECT * FROM media');
    return result.rows;
  }
}
