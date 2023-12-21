// Update with your config settings.
const { knexSnakeCaseMappers } = require('objection');
const config = require('../../../config');

const { client, metaConnection, pool } = config.SqlDB;
/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client,
    connection: metaConnection,
    pool,
    migrations: {
      tableName: 'knex_migrations',
    },
  },
  ...knexSnakeCaseMappers(),
};
