const data=require('../../../../assets/seed_data/shop_location.json')
exports.seed = async function(knex) {
  await knex('shop_location').del()
  await knex('shop_location').insert(data);
};