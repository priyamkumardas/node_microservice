const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DATA_BASE_ERROR extends BaseError {
  constructor(msg) {
    const code = 'DATA_BASE_ERROR';
    const statusCode = '502';
    const message = msg?msg:' Error while querrying the table in ums data_base ';
    const key = 'ums';
    super({ code, statusCode, message, key });
  }
}

module.exports = DATA_BASE_ERROR;
