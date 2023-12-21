const path = require('path');
const Knex = require('../apis/db/knex/knex');

const migrationConfig = {
  directory: path.join(__dirname, '../apis/db/knex/migrations'),
};

Knex.migrate
  .make(process.argv[3], migrationConfig)
  .then((response) => {
    console.info('Success', response);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error', error);
    process.exit(1);
  });
