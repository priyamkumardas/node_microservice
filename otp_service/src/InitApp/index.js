const Db = require('@root/src/apis/db/mongodb');
const { Logger: log } = require('sarvm-utility');
const { consumer } = require('./queueConsumer');

const init = async () => {
  const mongoConnection = new Db();
  mongoConnection.connect();

  // Unhandled Rejections and Exceptions process wide
  process
    .on('unhandledRejection', (reason) => {
      log.error({ 'Unhandled Rejection at Promise:': reason });
    })
    .on('uncaughtException', (error) => {
      log.error({ 'Uncaught Exception thrown:': error });
      process.exit(1);
    });
  consumer.start();
};

module.exports = init;
