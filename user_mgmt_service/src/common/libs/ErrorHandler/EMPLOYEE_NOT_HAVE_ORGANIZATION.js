const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class EMPLOYEE_NOT_HAVE_ORGANIZATION extends BaseError {
    constructor() {
        const code = 'EMPLOYEE_NOT_HAVE_ORGANIZATION';
        const statusCode = '500';
        const message = `This employee doesn't have organization.`;
        const key = 'ums';
        super({ code, statusCode, message, key });
    }
}

module.exports = EMPLOYEE_NOT_HAVE_ORGANIZATION;
