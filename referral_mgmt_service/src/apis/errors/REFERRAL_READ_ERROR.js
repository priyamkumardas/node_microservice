const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REFERRAL_READ_ERROR extends BaseError {
  constructor(error) {
    const code = "REFERRAL_READ_ERROR";
    const statusCode = 200;
    const message = "REFERRAL_READ_ERROR";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REFERRAL_READ_ERROR;
