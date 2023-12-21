const mongoose = require('mongoose');
const { monogURL } = require('@config');
const { DBError } = require('objection');

const { Logger } = require('sarvm-utility');

class Database {
  static _instance;

  constructor() {}

  static async getInstance() {
    if (this._instance) {
      return this._instance;
    }

    try {
      if (mongoose.connection.readyState === 0) {
        this._instance = await mongoose.connect(monogURL, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        Logger.info('Report service is connected to MongoDB');
      }
    } catch (err) {
      Logger.error(err);
      // throw new Error()
    }
    return this._instance;
  }
}

module.exports = Database;
