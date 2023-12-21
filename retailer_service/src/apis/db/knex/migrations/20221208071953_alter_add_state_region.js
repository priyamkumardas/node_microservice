const { TABLES } = require('../../../../constants/dbConstants');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.string('state', 50);
    table.string('region', 50);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(TABLES.TB_STORE_META_DATA, (table) => {
    table.dropColumn('state');
    table.dropColumn('region');
  });
};
