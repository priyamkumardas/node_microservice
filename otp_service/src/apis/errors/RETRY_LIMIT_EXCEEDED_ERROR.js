const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');
const {
  node: { serviceName },
} = require('@config');

class RETRY_LIMIT_EXCEEDED_ERROR extends BaseError {
  constructor(error) {
    const code = 'ERROR_RETRY_LIMIT_EXCEEDED';
    const statusCode = 200;
    const message = 'Retry limit has exceeded';
    const key = serviceName;
    super({ code, statusCode, message, key, error });
  }
}

module.exports = RETRY_LIMIT_EXCEEDED_ERROR;
