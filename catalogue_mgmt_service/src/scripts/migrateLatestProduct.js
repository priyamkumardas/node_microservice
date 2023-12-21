const path = require('path');
const Knex = require('../apis/db_meta/knex/knex');

const migrationConfig = {
  directory: path.join(__dirname, '../apis/db_meta/knex/migrations'),
};

Knex.migrate
  .latest(migrationConfig)
  .then(() => {
    console.log('Success : latest Schema applied');
    process.exit(0);
  })
  .catch((err) => {
    console.log('error', err);
    process.exit(1);
  });
