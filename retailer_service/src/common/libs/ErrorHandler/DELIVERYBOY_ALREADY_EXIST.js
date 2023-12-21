const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class DELIVERYBOY_ALREADY_EXIST extends BaseError {
    constructor() {
        const code = 'DELIVERYBOY_ALREADY_EXIST';
        const statusCode = '500';
        const message = 'Mobile number already registered.';
        const key = 'ums';
        super({ code, statusCode, message, key });
    }
}

module.exports = DELIVERYBOY_ALREADY_EXIST;
