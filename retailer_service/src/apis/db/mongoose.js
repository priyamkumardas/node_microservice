/* eslint-disable prefer-arrow-callback */
/* eslint-disable object-shorthand */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-var */
const { MongoClient } = require('mongodb');
const config = require('@config');
const { Logger } = require('sarvm-utility');

const url = `${config.db.connection.host}`;
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (db) {
        const db2 = db.db(config.db.connection.database);
        _db = db2.collection(config.db.connection.collectin);
        Logger.info('Successfully connected to MongoDB.');
        //console.log('Successfully connected to MongoDB.');
      }
      return callback(err);
    });
  },
  getDb: function () {
    return _db;
  },
};
