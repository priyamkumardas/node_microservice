const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class ORDER_NOT_FOUND extends BaseError {
  constructor(message) {
    const code = 'ORDER_SERVICE_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = ORDER_NOT_FOUND;
