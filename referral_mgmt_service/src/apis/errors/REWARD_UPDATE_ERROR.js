const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REWARD_UPDATE_ERROR extends BaseError {
  constructor(error) {
    const code = "REWARD_UPDATE_ERROR";
    const statusCode = 200;
    const message =
      "DB could not be updated. Please check if invite has been sent to this phone number.";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REWARD_UPDATE_ERROR;
