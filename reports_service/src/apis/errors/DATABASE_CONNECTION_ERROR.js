const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class DATABASE_CONNECTION_ERROR extends BaseError {
  constructor(error) {
    const code = "DATABASE_CONNECTION_ERROR";
    const statusCode = 400;
    const message = "Database connection not established";
    const key = "report";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = DATABASE_CONNECTION_ERROR;
