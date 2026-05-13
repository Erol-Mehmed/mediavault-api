import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import Media from './media.model';

@Injectable()
export class MediaRepository {
  constructor(private knexService: KnexService) {}

  async create(data: Partial<Media>): Promise<Media> {
    const sql = `
      INSERT INTO media(
        media_type, external_id, external_source, title, description,
        release_date, poster_url, backdrop_url, genres, rating,
        runtime, total_episodes, authors, platforms
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const params = [
      data.media_type,
      data.external_id,
      data.external_source,
      data.title,
      data.description ?? null,
      data.release_date ?? null,
      data.poster_url ?? null,
      data.backdrop_url ?? null,
      JSON.stringify(data.genres ?? []),
      data.rating ?? null,
      data.runtime ?? null,
      data.total_episodes ?? null,
      JSON.stringify(data.authors ?? []),
      JSON.stringify(data.platforms ?? []),
    ];

    const { rows } = await this.knexService.knex.raw<{ rows: Media[] }>(
      sql,
      this.knexService.normalizeBindings(params),
    );

    return rows[0];
  }

  async getAll(userId: string): Promise<Media[]> {
    const sql = `SELECT * FROM media WHERE user_id = ? ORDER BY created_at DESC`;
    const { rows } = await this.knexService.knex.raw<{
      rows: Media[];
    }>(sql, userId);

    return rows;
  }
}
