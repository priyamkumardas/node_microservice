const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DATABASE_CONNECTION_ERROR extends BaseError {
  constructor() {
    const code = 'DATA_BASE_ERROR';
    const statusCode = 404;
    const message = 'connection error';
    super({ code, statusCode, message });
    this.key = 'cms';
  }
}

module.exports = DATABASE_CONNECTION_ERROR;
