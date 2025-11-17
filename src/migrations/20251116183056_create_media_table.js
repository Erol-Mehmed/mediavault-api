/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('media', (table) => {
    table.increments('id').primary();

    table.string('media_type').notNullable();
    table.string('external_id').nullable();
    table.string('external_source').nullable();

    table.string('title').notNullable();
    table.text('description').nullable();
    table.date('release_date').nullable();

    table.string('poster_url').nullable();
    table.string('backdrop_url').nullable();

    table.jsonb('genres').defaultTo('[]');
    table.float('rating').nullable();

    table.integer('runtime').nullable();
    table.integer('total_episodes').nullable();

    table.jsonb('authors').defaultTo('[]');
    table.jsonb('platforms').defaultTo('[]');

    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('media');
};
