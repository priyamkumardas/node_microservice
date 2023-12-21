exports.up = async function (knex) {
  await knex.schema.createTable('retailer', function (table) {
    table.string('r_id', 50).primary();
    table.string('user_id', 50).unique().notNullable();
  });

  return knex.schema.createTable('payment_info', (table) => {
    table.string('payment_info_id', 50).primary();
    table.string('name', 50);
    table.string('mobile', 15);
    table.string('app', 50);
    table.string('upi', 50);
    table.string('qr_image', 50);
    table.boolean('active').defaultTo(true);
    table.string('r_id').notNullable();
    table.foreign('r_id').references('r_id').inTable('retailer');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('payment_info');
  return knex.schema.dropTableIfExists('retailer');
};
