const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class NULL_OTP_ERROR extends BaseError {
  constructor(error) {
    const code = 'NULL_OTP_ERROR';
    const statusCode = 401;
    const message = 'Otp is null from db';
    super({ code, statusCode, message, error });
  }
}

module.exports = NULL_OTP_ERROR;
