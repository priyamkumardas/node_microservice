/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .dropTableIfExists('catalog')
    .createTable('catalog', (table) => {
      table.string('id').primary().unsigned();
      table.string('name').notNullable().unique();
      table.text('image').nullable();
      table.integer('version').defaultTo(1);
      table.integer('order').defaultTo(1);
      table.string('dummyKey').unique();
      table.string('region').nullable();
      table.text('description').nullable();
      table.string('tax_slab').nullable();
      table.enu('status', ['ACTIVE', 'INACTIVE', 'DELETED']).defaultTo('ACTIVE');
      table.enu('tax_status', ['TAXABLE', 'NON_TAXABLE']).defaultTo('TAXABLE');
      table.string('created_by').nullable();
      table.string('updated_by').nullable();
      table.timestamp(true, true);
    })
    .dropTableIfExists('category')
    .createTable('category', (table) => {
      table.string('id').primary().unsigned();
      table.string('name').notNullable();
      table.text('image').nullable();
      table.string('region').nullable();
      table.integer('version').defaultTo(1);
      table.string('dummyKey').unique();
      table.text('description').nullable();
      table.string('tax_slab').nullable();
      table.enu('status', ['ACTIVE', 'INACTIVE', 'DELETED']).defaultTo('ACTIVE');
      table.enu('tax_status', ['TAXABLE', 'NON_TAXABLE']).defaultTo('TAXABLE');
      table.integer('order').defaultTo(1);
      table.string('created_by').nullable();
      table.string('updated_by').nullable();
      table.timestamp(true, true);
    })
    .dropTableIfExists('category_mapping')
    .createTable('category_mapping', (table) => {
      table.string('id').primary().unsigned();
      table.string('catalog_id').references('id').inTable('catalog');
      table.string('category_id').references('id').inTable('category');
      table.string('parent_id').references('id').inTable('category').nullable();
      table.string('parent_mapping_id').references('id').inTable('category_mapping').nullable();
      table.string('created_by').nullable();
      table.string('updated_by').nullable();
      table.timestamp(true, true);
    })
    .dropTableIfExists('product')
    .createTable('product', (table) => {
      table.string('id').primary().unsigned();
      table.string('name').notNullable().unique();
      table.text('description');
      table.text('image').nullable();
      table.string('place_of_origin');
      table.string('dummyKey').unique();
      table.string('min_oq');
      table.string('max_oq');
      table.string('min_ppo');
      table.string('weight_per_piece');
      table.string('rp'); // regular price
      table.string('mrp');
      table.string('sp'); // selling price
      table.string('return_option');
      table.boolean('veg');
      table.enu('tax_status', ['TAXABLE', 'NON_TAXABLE']).defaultTo('TAXABLE');
      table.string('hsn', 15);
      table.decimal('tax', 8, 2).nullable();
      table.decimal('min_price', 8, 2).nullable();
      table.decimal('max_price', 8, 2).nullable();
      table.json('metadata');
      table.enu('status', ['ACTIVE', 'INACTIVE', 'DELETED']).defaultTo('ACTIVE');
      table.integer('order').defaultTo(1);
      table.string('created_by');
      table.string('updated_by');
      table.timestamp(true, true);
    })
    .dropTableIfExists('category_product')
    .createTable('category_product', (table) => {
      table.string('id').primary().unsigned();
      table.string('product_id').references('id').inTable('product');
      table.string('catalog_id').references('id').inTable('catalog');
      table.string('category_mapping_id').references('id').inTable('category_mapping');
      table.string('created_by').nullable();
      table.string('updated_by').nullable();
      table.timestamp(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('catalog')
    .dropTableIfExists('category')
    .dropTableIfExists('category_mapping')
    .dropTableIfExists('product')
    .dropTableIfExists('category_product');
};
