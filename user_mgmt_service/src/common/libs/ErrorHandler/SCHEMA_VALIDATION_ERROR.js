const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility')


class SCHEMA_VALIDATION_ERROR extends BaseError {
  constructor(message) {
    const code = 'SCHEMA_VALIDATION_ERROR';
    const statusCode = '500';
    const key = 'ums';
    //const message='Number Must Be 10 Digit'
    super({ code, statusCode, key, message });
  }
}

module.exports = SCHEMA_VALIDATION_ERROR;