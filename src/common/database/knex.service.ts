import { Injectable } from '@nestjs/common';
import knex, { Knex } from 'knex';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KnexService {
  constructor(private configService: ConfigService) {
    this.knex = knex({
      client: 'pg',
      connection: {
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        database: this.configService.get<string>('database.name'),
        user: this.configService.get<string>('database.user'),
        password: this.configService.get<string>('database.password'),
      },
    });
  }

  public knex: Knex;

  /**
   * Convert `undefined` values in query bindings to `null` so they are valid
   * Knex/SQL bindings and satisfy the Knex TypeScript signatures.
   */
  public normalizeBindings(
    bindings: readonly (string | number | boolean | null | undefined)[],
  ): (string | number | boolean | null)[] {
    return bindings.map((v) => (v === undefined ? null : v));
  }
}
