const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class NO_PRODUCT_FOUND extends BaseError {
  constructor(message) {
    const code = 'NO_PRODUCT_FOUND';
    const statusCode = 404;
    super({ code, statusCode, message });
    this.key = 'cms';
  }
}

module.exports = NO_PRODUCT_FOUND;
