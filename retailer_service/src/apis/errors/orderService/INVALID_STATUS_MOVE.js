const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class INVALID_STATUS_MOVE extends BaseError {
  constructor(message) {
    const code = 'INVALID_STATUS_MOVE';
    const statusCode = 500;
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = INVALID_STATUS_MOVE;
