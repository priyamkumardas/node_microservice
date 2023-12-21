const { COL_VALUES, COLUMNS, TABLES } = require('../../../../constants/dbConstants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.string(COLUMNS.SHOP.ID).notNullable().defaultTo(COL_VALUES.SHOP.ID);
    // table.string('id').unique().notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
    table.dropColumn(COLUMNS.SHOP.ID);
    // table.dropUnique.dropColumn('id').notNullable();
  });
};
