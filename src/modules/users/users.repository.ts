import { Injectable } from '@nestjs/common';
import { KnexService } from '../../common/database/knex.service';
import User from './users.model';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(private knexService: KnexService) {}

  async register(data: CreateUserDto): Promise<User> {
    const sql = `
      INSERT INTO users(email, password, is_active, username, first_name, last_name)
      VALUES(?, ?, ?, ?, ?, ?)
      RETURNING *
    `;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const params = [
      data.email,
      hashedPassword,
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

  async findByEmail(email: string) {
    const sql = `SELECT * FROM users WHERE email = ?`;
    const { rows } = await this.knexService.knex.raw<{ rows: User[] }>(sql, [
      email,
    ]);

    return rows[0];
  }
}
