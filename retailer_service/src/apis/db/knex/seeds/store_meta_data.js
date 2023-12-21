const data=require('../../../../assets/seed_data/store_meta_data.json')
exports.seed = async function(knex) {
  await knex('store_meta_data').del()
  await knex('store_meta_data').insert(data);
};