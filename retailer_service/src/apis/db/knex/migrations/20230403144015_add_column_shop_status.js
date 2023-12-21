exports.up = function (knex) {
  return knex.schema.table('shop', function (table) {
    table.string('shop_status').defaultTo('open');
  });
};

exports.down = function (knex) {
  return knex.schema.table('shop', function (table) {
    table.dropColumn('shop_status');
  });
};
