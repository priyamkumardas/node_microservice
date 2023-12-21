const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class SEND_INVITE_ERROR extends BaseError {
  constructor(error) {
    const code = "SEND_INVITE_ERROR";
    const statusCode = 200;
    const message = "Error sending invite";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = SEND_INVITE_ERROR;
