const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DB_CONNECTION_ERROR extends BaseError {
  constructor(error) {
    const code = 'DB_CONNECTION_ERROR';
    const statusCode = 401;
    const message = 'Error in connecting DB';
    super({ code, statusCode, message, error });
  }
}

module.exports = DB_CONNECTION_ERROR;
