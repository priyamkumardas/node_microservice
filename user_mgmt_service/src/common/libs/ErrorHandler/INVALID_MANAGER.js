const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class INVALID_MANAGER extends BaseError {
    constructor() {
        const code = 'INVALID_MANAGER';
        const statusCode = '500';
        const message = `You can't create this employee under this manager.`;
        const key = 'ums';
        super({ code, statusCode, message, key });
    }
}

module.exports = INVALID_MANAGER;
