/* eslint-disable object-curly-newline */
/* eslint-disable no-console */
const mongoose = require('mongoose');
const UserModel = require('@models/Users');
const EmployeeModel = require('@models/Employee');
const config = require('@config');

const { Logger: log } = require('sarvm-utility');
// eslint-disable-next-line no-unused-vars
const { USERNAME, PASSWORD, CLUSTER, url } = config.mongodb;

class db {
  constructor() {
    if (!db.instance) {
      db.instance = this;
    }
    // eslint-disable-next-line no-constructor-return
    return db.instance;
  }

  static getInstance() {
    return this.instance;
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
      log.info('UMS is connected to MonogoDB');
    });

    this.Users = UserModel;
    this.Employees = EmployeeModel;
  }
}

module.exports = db;
