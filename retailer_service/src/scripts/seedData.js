const path = require('path');
const Knex = require('../apis/db/knex/knex');

/*Add  seeds files path*/
const seedConfig = {
  directory: path.join(__dirname, '../apis/db/knex/seeds'),
};

Knex.seed
  .run(seedConfig)
  .then(() => {
    console.log('Success : Seed data is added');
    process.exit(0);
  })
  .catch((err) => {
    console.log('error', err);
    process.exit(1);
  });
