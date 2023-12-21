const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const { Logger: log } = require('sarvm-utility');
const {
  db: {
    connection: { host },
  },
} = require('@config');
const { DATABASE_CONNECTION_ERROR } = require('../errors/CommonError');

class Database {
  static async connect() {
    try {
      if (mongoose.connection.readyState === 0) {
        await mongoose.connect(host);
        log.warn({ warn: 'CMS is connected to MongoDB' });
      }
    } catch (err) {
      console.log(err);
      throw new DATABASE_CONNECTION_ERROR(err);
    }
  }
}

module.exports = Database;
