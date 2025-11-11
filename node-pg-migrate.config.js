require('dotenv').config();

export const migrationsTable = 'pgmigrations';
export const dir = 'migrations';
export const direction = 'up';
export const verbose = true;
export const checkOrder = true;
export const migrationFileLanguage = 'js';
export const databaseUrl = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
};
