const { COLUMNS, TABLES } = require('../../../../constants/dbConstants');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
        table.varchar("min_order_value").nullable().defaultTo(null);
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.alterTable(TABLES.TB_SHOP, (table) => {
        table.dropColumn("min_order_value");
    })
};
