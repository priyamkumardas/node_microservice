/* eslint-disable no-console */
const mongoose = require('mongoose');
const UserModel = require('@models/Users');
const config = require('@config');

const { Logger } = require('sarvm-utility');

const { USERNAME, PASSWORD, CLUSTER, url } = config.mongodb;

class db {
  constructor() {
    if (!db.instance) {
      db.instance = this;
    }
    return db.instance;
  }

  connect() {
    mongoose.set('strictQuery', true);
    mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const { connection } = mongoose;
    connection.on('error', console.error.bind(console, 'connection error: '));
    connection.once('open', () => {
      Logger.info('Mongodb Connected successfully');
    });

    this.Users = UserModel;
  }

  static getInstance() {
    return this.instance;
  }
}

module.exports = db;
