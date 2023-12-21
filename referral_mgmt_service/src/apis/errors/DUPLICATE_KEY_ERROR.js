const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");
class DUPLICATE_KEY_ERROR extends BaseError {
  constructor(error) {
    const code = "DUPLICATE_KEY_ERROR";
    const statusCode = 200;
    const message = "The user has already has an active referral";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = DUPLICATE_KEY_ERROR;
