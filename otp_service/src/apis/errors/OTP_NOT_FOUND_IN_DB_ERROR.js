const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class OTP_NOT_FOUND_IN_DB_ERROR extends BaseError {
  constructor(error) {
    const code = 'OTP_NOT_FOUND_IN_DB_ERROR';
    const statusCode = 401;
    const message = 'Error in getting OTP from DB';
    super({ code, statusCode, message, error });
  }
}

module.exports = OTP_NOT_FOUND_IN_DB_ERROR;
