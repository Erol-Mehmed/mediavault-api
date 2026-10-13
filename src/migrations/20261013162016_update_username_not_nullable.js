/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.alterTable('users', (table) =>{
    table.string('username').notNullable().alter();
    table.unique(['username'], 'users_username_unique');
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.alterTable('users', (table) => {
    table.string('username').nullable().alter();
    table.dropUnique(['username'], 'users_username_unique');
  });
};
