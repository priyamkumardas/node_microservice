const path = require('path');
const Knex = require('../knex/knex');

const migrationConfig = {
  directory: path.join(__dirname, '../knex/migrations'),
};

Knex.migrate
  .latest(migrationConfig)
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
