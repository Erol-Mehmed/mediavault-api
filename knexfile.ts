import type { Knex } from 'knex';
import path from 'path';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'postgres',
    database: process.env.DB_NAME || 'mediavault',
  },
  migrations: {
    extension: 'js',
    directory: path.join(__dirname, 'src/migrations'),
    tableName: 'migrations',
  },
  seeds: {
    extension: 'ts',
    directory: path.join(__dirname, 'src/seeds'),
  },
};

module.exports = config;
