const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class MOBILE_CANT_UPDATE extends BaseError {
  constructor() {
    const code = 'MOBILE_CANT_UPDATE';
    const statusCode = '500';
    const message = 'Update of number not possible now';
    const key = 'ums';
    super({ code, statusCode, message, key });
  }
}

module.exports = MOBILE_CANT_UPDATE;
