const { TABLES } = require('../../../../constants/dbConstants');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.boolean('hasDummySub');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.dropColumn('hasDummySub');
  });
};
