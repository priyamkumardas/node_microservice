const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class SEND_REMINDER_ERROR extends BaseError {
  constructor(error) {
    const code = "SEND_REMINDER_ERROR";
    const statusCode = 200;
    const message = "Error while sending reminder";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = SEND_REMINDER_ERROR;
