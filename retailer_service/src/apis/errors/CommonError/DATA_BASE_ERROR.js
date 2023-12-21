const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DATA_BASE_ERROR extends BaseError {
  constructor() {
    const code = 'DATA_BASE_ERROR';
    const statusCode = 404;
    const message = 'error while query with table';
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = DATA_BASE_ERROR;
