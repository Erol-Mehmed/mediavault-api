import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import Media from './media.model';

@Injectable()
export class MediaRepository {
  constructor(private knexService: KnexService) {}

  async findAll(): Promise<Media[]> {
    const sql = 'SELECT * FROM media';
    const result = await this.knexService.knex.raw<{
      rows: Media[];
    }>(sql);

    return result.rows;
  }
}
