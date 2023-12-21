const {
  ErrorHandler: { BaseError },
} = require('sarvm-utility');

class EMPLOYEE_DOES_NOT_EXIST extends BaseError {
  constructor() {
    const code = 'EMPLOYEE_DOES_NOT_EXIST';
    const statusCode = '200';
    const message = 'Employee does not exist';
    const key = 'ums';
    super({ code, statusCode, message, key });
  }
}

module.exports = EMPLOYEE_DOES_NOT_EXIST;
