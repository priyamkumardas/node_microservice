/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.dropTableIfExists('matercatalog').createTable('matercatalog', (table) => {
    table.string('id').primary().unsigned();
    table.string('url').notNullable().unique();
    table.text('version').nullable();
    table.string('active').nullable();
    table.string('created_by').nullable();
    table.string('updated_by').nullable();
    table.string('created_at').notNullable();
    table.string('updated_at').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('product').dropTableIfExists('category').dropTableIfExists('category_Product');
};
