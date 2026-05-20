import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import { RefreshToken } from './types/refresh-token.type';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly knexService: KnexService) {}

  async create(data: RefreshToken): Promise<RefreshToken> {
    const sql = `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?) RETURNING *`;

    const params = [data.user_id, data.token_hash, data.expires_at];

    const { rows } = await this.knexService.knex.raw<{ rows: RefreshToken[] }>(
      sql,
      params,
    );

    return rows[0];
  }
}
