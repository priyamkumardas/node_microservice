const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class INTERNAL_SERVER_ERROR extends BaseError {
  constructor(message) {
    const code = 'INTERNAL_SERVER_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'cms';
  }
}

module.exports = INTERNAL_SERVER_ERROR;
