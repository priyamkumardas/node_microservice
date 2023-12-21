const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class MANAGER_DOES_NOT_EXISTS_ERROR extends BaseError {
  constructor() {
    const code = 'MANAGER_DOES_NOT_EXISTS_ERROR';
    const statusCode = '200';
    const message = 'Manager id should be an existing Employee id';
    const key = 'ums';
    super({ code, statusCode, message, key });
  }
}

module.exports = MANAGER_DOES_NOT_EXISTS_ERROR;
