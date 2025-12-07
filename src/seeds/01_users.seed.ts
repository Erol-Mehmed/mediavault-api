import { Knex } from 'knex';
import { userFactory } from '../factories/user.factory';

export async function seed(knex: Knex): Promise<void> {
  await knex('users').del();

  const users = Array.from({ length: 20 }).map(() => userFactory());

  await knex('users').insert(users);
}
