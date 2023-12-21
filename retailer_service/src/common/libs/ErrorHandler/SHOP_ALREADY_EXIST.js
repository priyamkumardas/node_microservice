const {
    ErrorHandler: { BaseError },
} = require('sarvm-utility');

class SHOP_ALREADY_EXIST extends BaseError {
    constructor() {
        const code = 'SHOP_ALREADY_EXIST';
        const statusCode = '400';
        const message = 'Shop already exist for this user';
        const key = "rms";
        const error = "Shop already exist for this user"
        super({ code, statusCode, message, key, error }); //{ code, statusCode, message, key, error = null }
    }
}

module.exports = SHOP_ALREADY_EXIST;
