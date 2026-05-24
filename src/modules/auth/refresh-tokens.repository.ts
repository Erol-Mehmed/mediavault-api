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

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    const sql = `SELECT * FROM refresh_tokens WHERE user_id = ? AND revoked = false AND expires_at > now()`;
    const { rows } = await this.knexService.knex.raw<{ rows: RefreshToken[] }>(
      sql,
      [userId],
    );

    return rows;
  }

  async revoke(tokenId: string): Promise<RefreshToken> {
    const sql = `UPDATE refresh_tokens SET revoked = true WHERE id = ?`;
    const { rows } = await this.knexService.knex.raw<{ rows: RefreshToken[] }>(
      sql,
      [tokenId],
    );

    return rows[0];
  }
}
