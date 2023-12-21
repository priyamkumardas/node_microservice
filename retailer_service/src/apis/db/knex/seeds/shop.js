
const data=require('../../../../assets/seed_data/shop.json')
exports.seed = async function(knex) {
  await knex('shop').del()
  await knex('shop').insert(data);
};
