const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class UNAUTHORIZED_ACCESS extends BaseError {
  constructor() {
    const code = 'UNAUTHORIZED_ACCESS';
    const statusCode = '401';
    const key = 'admin';
    const message = 'only admin access';
    super({ code, statusCode, key, message });
  }
}

module.exports = UNAUTHORIZED_ACCESS;
