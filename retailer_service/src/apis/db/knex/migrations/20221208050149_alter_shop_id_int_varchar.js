const { COLUMNS, TABLES } = require('../../../../constants/dbConstants');
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.string('shop_number').alter();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(TABLES.TB_STORE_META_DATA, (table) => {
    table.integer('shop_number').alter();
  });
};
