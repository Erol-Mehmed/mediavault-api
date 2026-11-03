import { Injectable } from '@nestjs/common';
import { KnexService } from '../../../common/database/knex.service';

@Injectable()
export class PasswordResetRepository {
  constructor(private readonly knexservice: KnexService) {}

  async invalidateActiveByUserId(userId: string) {
    const sql = `UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()`;
    const { rows } = this.knexservice.knex.row;
  }
}
