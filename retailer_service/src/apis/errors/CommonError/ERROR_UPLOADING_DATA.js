const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class ERROR_UPLOADING_DATA extends BaseError {
  constructor() {
    const code = 'ERROR_UPLOADING_DATA';
    const statusCode = 404;
    const message = 'Error while uploading data on s3 bucket';
    super({ code, statusCode, message });
    this.key = 'rms';
  }
}

module.exports = ERROR_UPLOADING_DATA;
