const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class RETRY_OTP_ERROR extends BaseError {
  constructor(error) {
    super();
    this.code = 'RETRY_OTP_ERROR';
    this.message = 'OTP retry error';
    this.statusCode = 200;
    this.key = 'otp';
  }
}

module.exports = RETRY_OTP_ERROR;
