const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class LOGISTIC_SERVICE_ERROR extends BaseError {
  constructor(message) {
    const code = 'LOGISTIC_SERVICE_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = LOGISTIC_SERVICE_ERROR;
