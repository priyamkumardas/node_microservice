/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .raw('CREATE EXTENSION postgis')
    .createTable('shop', (table) => {
      table.primary('shop_id');
      table.increments('shop_id');
      table.string('user_id').notNullable();
      table.string('shop_name').notNullable();
      table.double('longitude').notNullable();
      table.double('latitude').notNullable();
      table.integer('shop_number').notNullable();
      table.string('locality').notNullable();
      table.string('landmark').notNullable();
      table.string('city').notNullable();
      table.string('street');
      table.string('veg');
      table.string('delivery');
      table.string('image');
      table.string('type_of_retailer');
      table.string('GST_no');
      table.boolean('isSubscribed');
      table.boolean('isKYCVerified');
      table.string('selling_type');
      table.integer('pincode').notNullable();
      table.timestamps(true, true);
    })

    .createTable('workinghours', (table) => {
      table.primary('id');
      table.increments('id');
      table.integer('shop_id').notNullable();
      table.integer('start_time').notNullable();
      table.integer('end_time').notNullable();
      table.boolean('is_active').notNullable().defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('shop_location', (table) => {
      table.integer('shop_id');
      table.string('longitude');
      table.string('latitude');
      table.geometry('shoplocation');
    })
    .createTable('store_meta_data', (table) => {
      table.primary('id');
      table.increments('id');
      table.integer('shop_id').notNullable();
      table.integer('version').notNullable();
      table.string('url').notNullable();
      table.boolean('active').notNullable();
    });
};
// orders [ ]

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('shop').dropTableIfExists('workinghours').dropTableIfExists('store_meta_data');
};
