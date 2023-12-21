const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class MESSAGING_SERVICE_ERROR extends BaseError {
  constructor(message) {
    const code = 'MESSAGING_SERVICE_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = MESSAGING_SERVICE_ERROR;
