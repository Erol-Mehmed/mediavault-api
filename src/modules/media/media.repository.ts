import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import Media from './media.model';
import { CreateMediaData } from './types/create-media-data.type';

@Injectable()
export class MediaRepository {
  constructor(private knexService: KnexService) {}

  async create(data: CreateMediaData): Promise<Media> {
    const sql = `
      INSERT INTO media(
        user_id, media_type, external_id, external_source, title, description,
        release_date, poster_url, backdrop_url, genres, rating,
        runtime, total_episodes, authors, platforms
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const params = [
      data.user_id,
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

  async update(
    userId: string,
    id: string,
    data: Partial<Media>,
  ): Promise<Media> {
    const cleanData = Object.entries(data);
    const setClause = cleanData.map(([key]) => `${key} = ?`).join(', ');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const values = cleanData.map(([_, value]) =>
      typeof value === 'object' ? JSON.stringify(value) : value,
    );

    const sql = `
    UPDATE media
    SET ${setClause}
    WHERE id = ? AND user_id = ?
    RETURNING *
  `;

    const { rows } = await this.knexService.knex.raw<{ rows: Media[] }>(
      sql,
      this.knexService.normalizeBindings([...values, id, userId]),
    );

    return rows[0];
  }

  async remove(userId: string, id: string): Promise<Media> {
    const sql = `DELETE FROM media WHERE user_id = ? AND id = ? RETURNING id`;
    const { rows } = await this.knexService.knex.raw<{
      rows: Media[];
    }>(sql, [userId, id]);

    return rows[0] ?? null;
  }

  async getAll(userId: string): Promise<Media[]> {
    const sql = `SELECT * FROM media WHERE user_id = ? ORDER BY created_at DESC`;
    const { rows } = await this.knexService.knex.raw<{
      rows: Media[];
    }>(sql, [userId]);

    return rows;
  }

  async getOne(userId: string, id: string): Promise<Media> {
    const sql = `SELECT * FROM media WHERE user_id = ? AND id = ?`;
    const { rows } = await this.knexService.knex.raw<{
      rows: Media[];
    }>(sql, [userId, id]);

    return rows[0] ?? null;
  }
}
