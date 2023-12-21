const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REWARDS_COULD_NOT_BE_ADDED extends BaseError {
  constructor(error) {
    const code = "REWARDS_COULD_NOT_BE_ADDED";
    const statusCode = 200;
    const message = "REWARDS_COULD_NOT_BE_ADDED";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REWARDS_COULD_NOT_BE_ADDED;
