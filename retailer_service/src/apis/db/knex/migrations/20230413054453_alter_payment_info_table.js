exports.up = function (knex) {
  return knex.schema.alterTable('payment_info', function (table) {
    table.string('qr_image', 255).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('payment_info', function (table) {
    table.string('qr_image', 255).alter();
  });
};
