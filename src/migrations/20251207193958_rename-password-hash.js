/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  const tableName = 'users';
  const from = 'password_hash';
  const to = 'password';

  const hasFrom = await knex.schema.hasColumn(tableName, from);
  const hasTo = await knex.schema.hasColumn(tableName, to);

  if (hasFrom && !hasTo) {
    await knex.schema.alterTable(tableName, (table) => {
      table.renameColumn(from, to);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  const tableName = 'users';
  const from = 'password';
  const to = 'password_hash';

  const hasFrom = await knex.schema.hasColumn(tableName, from);
  const hasTo = await knex.schema.hasColumn(tableName, to);

  if (hasFrom && !hasTo) {
    await knex.schema.alterTable(tableName, (table) => {
      table.renameColumn(from, to);
    });
  }
};
