const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class SEND_OTP_ERROR extends BaseError {
  constructor(error) {
    const code = 'SEND_OTP_ERROR';
    const statusCode = 500;
    const message = 'Unable to send OTP';
    super({ code, statusCode, message, error });
  }
}

module.exports = SEND_OTP_ERROR;
