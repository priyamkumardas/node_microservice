const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class SHOP_NOT_FOUND_ERROR extends BaseError {
  constructor() {
    const code = 'SHOP_NOT_FOUND_ERROR';
    const statusCode = 404;
    const message = 'Shop not found';
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = SHOP_NOT_FOUND_ERROR;
