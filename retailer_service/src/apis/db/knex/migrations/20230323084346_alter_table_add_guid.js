const { v4: uuidv4 } = require('uuid');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.alterTable('shop', function (table) {
    table.string('guid', 36).nullable().defaultTo(null);
  });
  return knex('shop')
    .select('user_id')
    .then((rows) => {
      return Promise.all(
        rows.map((row) => {
          const guid = uuidv4(); // Generate a new UUID value
          return knex('shop').where({ user_id: row.user_id }).update({ guid: guid });
          // Update the guid column with the generated UUID value
        }),
      );
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table('shop', function (table) {
    table.dropColumn('guid');
  });
};
