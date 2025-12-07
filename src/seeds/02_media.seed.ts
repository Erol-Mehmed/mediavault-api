import { Knex } from 'knex';
import { movieFactory } from '../factories/media.factory';

export async function seed(knex: Knex): Promise<void> {
  await knex('media').del();

  const movies = Array.from({ length: 20 }).map(() => movieFactory());

  await knex('media').insert(movies);
}
