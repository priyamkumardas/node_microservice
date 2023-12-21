const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class EMPLOYEE_ALREADY_EXIST extends BaseError {
  constructor() {
    const code = 'EMPLOYEE_ALREADY_EXIST';
    const statusCode = '200';
    const message = 'Employee already exist';
    const key = 'ums';
    super({ code, statusCode, message, key });
  }
}

module.exports = EMPLOYEE_ALREADY_EXIST;
