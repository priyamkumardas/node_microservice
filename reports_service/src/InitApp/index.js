const sarvmUtility = require("sarvm-utility");
const { Logger } = require("sarvm-utility");
const DB = require("@db");
const SqlDb = require("@db/SQL");
const init = async (app) => {
  // const { Logger } = sarvmUtility;

  // const logger = new Logger();
  // const simpleFileLocation = "./src/logs/simple.log";
  // const jsonFileLocation = "./src/logs/json.log";
  // logger.configure(simpleFileLocation, jsonFileLocation);
  const dbConnection = new SqlDb();
  dbConnection.connect();
  await DB.getInstance();

  // Unhandled Rejections and Exceptions process wide
  process
    .on("unhandledRejection", (reason) => {
      Logger.error({ "Unhandled Rejection at Promise:": reason });
    })
    .on("uncaughtException", (error) => {
      Logger.error({ "Uncaught Exception thrown:": error });
      process.exit(1);
    });
};

module.exports = init;
