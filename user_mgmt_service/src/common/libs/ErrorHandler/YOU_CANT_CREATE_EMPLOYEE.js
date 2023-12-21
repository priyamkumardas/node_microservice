const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class YOU_CANT_SARVM_EMPLOYEE extends BaseError {
    constructor() {
        const code = 'YOU_CANT_SARVM_EMPLOYEE';
        const statusCode = '500';
        const message = 'You cant create employee for this organization.';
        const key = 'ums';
        super({ code, statusCode, message, key });
    }
}

module.exports = YOU_CANT_SARVM_EMPLOYEE;
