const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class ORDER_SERVICE_ERROR extends BaseError {
  constructor() {
    const code = 'ORDER_SERVICE_ERROR';
    const statusCode = 404;
    const message = 'error while fatching data from order service';
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = ORDER_SERVICE_ERROR;
