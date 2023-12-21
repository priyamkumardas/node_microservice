const sarvmUtility = require("sarvm-utility");
const { Logger } = require("sarvm-utility");
const DB = require("@db");

const init = async (app) => {
  // const { Logger } = sarvmUtility;

  // const logger = new Logger();
  // const simpleFileLocation = "./src/logs/simple.log";
  // const jsonFileLocation = "./src/logs/json.log";
  // logger.configure(simpleFileLocation, jsonFileLocation);
  await DB.getInstance();

  // Unhandled Rejections and Exceptions process wide
  process
    .on("unhandledRejection", (reason) => {
      console.log("unhandled rejection is", reason)
      Logger.error({ "Unhandled Rejection at Promise:": reason });
    })
    .on("uncaughtException", (error) => {
      // console.log("uncaught exception is", error)
      Logger.error({ "Uncaught Exception thrown:": error });
      process.exit(1);
    });
};

module.exports = init;
