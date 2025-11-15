import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnexService {
  public knex: Knex;

  constructor(private config: ConfigService) {
    this.knex = knex({
      client: 'pg',
      connection: {
        host: this.config.get<string>('database.host'),
        port: this.config.get<number>('database.port'),
        database: this.config.get<string>('database.name'),
        user: this.config.get<string>('database.user'),
        password: this.config.get<string>('database.password'),
      },
    });
  }
}
