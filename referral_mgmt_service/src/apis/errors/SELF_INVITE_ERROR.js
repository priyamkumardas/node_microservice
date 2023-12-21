const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class SELF_INVITE_ERROR extends BaseError {
  constructor(error) {
    const code = "SELF_INVITE_ERROR";
    const statusCode = 200;
    const message = "Can't send invite to self";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = SELF_INVITE_ERROR;
