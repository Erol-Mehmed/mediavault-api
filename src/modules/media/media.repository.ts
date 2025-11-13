import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Media } from './media.model';

@Injectable()
export class MediaRepository {
  private readonly pool = new Pool({
    connectionString: process.env.DATABASE_URL;
  });

  async findAllMedia(): Promise<Media[]> {
    const result = await this.db.query<Media>('SELECT * FROM media');
    return result.rows;
  }
}
