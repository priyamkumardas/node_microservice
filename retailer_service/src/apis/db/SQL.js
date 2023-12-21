const { Logger } = require('sarvm-utility');
const { Model } = require('objection');
const { DATABASE_CONNECTION_ERROR } = require('../errors');

// const { Logger: Log4jLogger } = require('sarvm-utility');
const Knex = require('./knex/knex');

// const Logger = new Log4jLogger();
class SqlDb {
  constructor() {
    if (!SqlDb.instance) {
      SqlDb.instance = this;
    }
  }

  connect() {
    Model.knex(Knex);

    Knex.raw('SELECT 1')
      .then(() => {
        //console.log({ msg: 'SQL Connected' });
        Logger.info({ msg: 'SQL connected' });
      })
      .catch((e) => {
        throw new DATABASE_CONNECTION_ERROR(e);
      });

    this.Knex = Knex;
  }

  static getInstance() {
    return this.instance;
  }
}

module.exports = SqlDb;
