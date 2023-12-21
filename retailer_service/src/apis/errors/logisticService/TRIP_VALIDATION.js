const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class TRIP_VALIDATION extends BaseError {
    constructor(message) {
        const code = 'TRIP_VALIDATION';
        const statusCode = 500;
        super({ code, statusCode, message });
        this.key = 'rms';
    }
}

module.exports = TRIP_VALIDATION;
