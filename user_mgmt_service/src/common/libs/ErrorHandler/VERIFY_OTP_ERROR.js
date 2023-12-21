const BaseError = require('sarvm-utility/src/common/libs/ErrorHandler/BaseError');

class VERIFY_OTP_ERROR extends BaseError {
  constructor(error) {
    const code = 'VERIFY_OTP_ERROR';
    const statusCode = 401;
    const message = 'Invalid OTP';
    super({ code, statusCode, message, error });
  }
}

module.exports = VERIFY_OTP_ERROR;
