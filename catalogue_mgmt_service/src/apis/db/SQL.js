const { Model } = require('objection');

// const { Logger: Log4jLogger } = require('sarvm-utility');
const Knex = require('./knex/knex');

// const Logger = new Log4jLogger();
class SqlDbMeta {
  constructor() {
    if (!SqlDbMeta.instance) {
      SqlDbMeta.instance = this;
    }
    return SqlDbMeta.instance;
  }

  connect() {
    Model.knex(Knex);

    Knex.raw('SELECT 1')
      .then(() => {
        console.log({ msg: 'SQL Connected' });
        // Logger.info({ msg: 'SQL connected' });
      })
      .catch((e) => {
        console.log({ msg: 'Catalog SQL not Connected' });
        // Logger.info({ msg: 'SQL not connected' });
        // Logger.error(e);
      });

    this.Knex = Knex;
  }

  static getInstance() {
    return this.instance;
  }
}

module.exports = SqlDbMeta;
