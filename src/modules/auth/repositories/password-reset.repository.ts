import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../common/database/knex.service';
import { CreatePasswordResetToken } from '../types/create-password-reset-token.type';
import { PasswordResetToken } from '../types/password-reset-token.type';

@Injectable()
export class PasswordResetRepository {
  constructor(private readonly knexService: KnexService) {}

  async invalidateActiveByUserId(userId: string): Promise<void> {
    const sql = `UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()`;
    await this.knexService.knex.raw(sql, [userId]);
  }

  async create(data: CreatePasswordResetToken): Promise<PasswordResetToken> {
    const sql = `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?) RETURNING *`;
    const params = [data.user_id, data.token_hash, data.expires_at];

    const { rows } = await this.knexService.knex.raw<{
      rows: PasswordResetToken[];
    }>(sql, params);

    return rows[0];
  }

  async findValidToken(tokenHash: string): Promise<PasswordResetToken | null> {
    const sql = `SELECT * FROM password_reset_tokens WHERE token_hash = ? AND used_at IS Null AND expires_at > NOW()`;

    const { rows } = await this.knexService.knex.raw<{
      rows: PasswordResetToken[];
    }>(sql, [tokenHash]);

    return rows[0] || null;
  }
}
