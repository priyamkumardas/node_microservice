/* eslint-disable no-constructor-return */
/* eslint-disable lines-between-class-members */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const OtpModel = require('@models/index');
const config = require('@config');
const { Logger: log } = require('sarvm-utility');

const { host } = config.db.connection;

class db {
  constructor() {
    if (!db.instance) {
      db.instance = this;
    }
    return db.instance;
  }

  connect() {
    const url = `${host}`;

    mongoose.connect(url);

    const { connection } = mongoose;
    connection.on('error', () => {
      log.error('error while connecting to db : ');
    });
    connection.once('open', () => {
      log.info('Mongodb Connected successfully');
    });

    this.Otp = OtpModel;
  }

  static getInstance() {
    return this.instance;
  }
}

module.exports = db;
