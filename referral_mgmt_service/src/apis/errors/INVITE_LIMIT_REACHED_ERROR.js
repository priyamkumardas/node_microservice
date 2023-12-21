const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class INVITE_LIMIT_REACHED_ERROR extends BaseError {
  constructor(error) {
    const code = "INVITE_LIMIT_REACHED_ERROR";
    const statusCode = 200;
    const message = "Invite limit reached";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = INVITE_LIMIT_REACHED_ERROR;
