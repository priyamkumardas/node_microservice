const data=require('../../../../assets/seed_data/workinghours.json')
exports.seed = async function(knex) {
  await knex('workinghours').del()
  await knex('workinghours').insert(data);
};