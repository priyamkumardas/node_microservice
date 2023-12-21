const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DATA_BASE_ERROR extends BaseError {
  constructor(message) {
    const code = 'DATA_BASE_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'cms';
  }
}

module.exports = DATA_BASE_ERROR;
