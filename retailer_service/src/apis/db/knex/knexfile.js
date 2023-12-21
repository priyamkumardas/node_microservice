// Update with your config settings.
const { knexSnakeCaseMappers } = require('objection');
const config = require('../../../config');

const { client, connection, pool } = config.SqlDB;
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client,
    connection,
    pool,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  ...knexSnakeCaseMappers(),
};
