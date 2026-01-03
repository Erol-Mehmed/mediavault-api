/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('refresh_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table.uuid('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
    table.string('token_hash', 255).notNullable();
    table.timestamp('expires_at', true).notNullable();
    table.boolean('revoked').notNullable().defaultTo(false);

    table.timestamp('created_at', true).defaultTo(knex.fn.now()).notNullable();
    table.timestamp('updated_at', true).defaultTo(knex.fn.now()).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('refresh_tokens');
};
