/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropPrimary();
    table.dropColumn('id');
  });

  await knex.schema.alterTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.alterTable('users', (table) => {
    table.dropPrimary();
    table.dropColumn('id');
  });

  await knex.schema.alterTable('users', (table) => {
    table.increments('id').primary();
  });
};
