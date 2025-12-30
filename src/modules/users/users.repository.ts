import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import User from './users.model';

@Injectable()
export class UsersRepository {
  constructor(private knexService: KnexService) {}

  async create(data: Partial<User>): Promise<User> {
    const sql = `
      INSERT INTO users(email, password, is_active, username, first_name, last_name)
      VALUES(?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const params = [
      data.email,
      data.password,
      data.is_active,
      data.username,
      data.first_name,
      data.last_name,
    ];

    const { rows } = await this.knexService.knex.raw<{ rows: User[] }>(
      sql,
      params,
    );

    return rows[0];
  }

  async getAll(): Promise<User[]> {
    const sql = `SELECT * FROM users ORDER BY created_at DESC`;
    const { rows } = await this.knexService.knex.raw<{ rows: User[] }>(sql);

    return rows;
  }
}
