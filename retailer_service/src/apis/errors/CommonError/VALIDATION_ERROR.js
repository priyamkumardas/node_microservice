const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class VALIDATION_ERROR extends BaseError {
  constructor(message) {
    const code = 'VALIDATION_ERROR';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = VALIDATION_ERROR;
