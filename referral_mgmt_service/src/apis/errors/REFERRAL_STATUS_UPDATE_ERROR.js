const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REFERRAL_STATUS_UPDATE_ERROR extends BaseError {
  constructor(error) {
    const code = "REFERRAL_STATUS_UPDATE_ERROR";
    const statusCode = 200;
    const message = "Error updating referral status";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REFERRAL_STATUS_UPDATE_ERROR;
