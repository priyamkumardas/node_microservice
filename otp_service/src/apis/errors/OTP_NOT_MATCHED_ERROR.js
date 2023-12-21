const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class OTP_NOT_MATCHED_ERROR extends BaseError {
  constructor(error) {
    const code = 'OTP_NOT_MATCHED';
    const statusCode = 401;
    const message = 'Incorrect OTP';
    super({ code, statusCode, message, error });
  }
}

module.exports = OTP_NOT_MATCHED_ERROR;
