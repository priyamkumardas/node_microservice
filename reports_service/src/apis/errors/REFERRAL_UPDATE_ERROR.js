const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REFERRAL_UPDATE_ERROR extends BaseError {
  constructor(error) {
    const code = "REFERRAL_UPDATE_ERROR";
    const statusCode = 200;
    const message =
      "DB could not be updated. Please check if invite has been sent to this phone number.";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REFERRAL_UPDATE_ERROR;
