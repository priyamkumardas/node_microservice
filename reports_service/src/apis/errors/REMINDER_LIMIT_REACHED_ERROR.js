const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REMINDER_LIMIT_REACHED_ERROR extends BaseError {
  constructor(error) {
    const code = "REMINDER_LIMIT_REACHED_ERROR";
    const statusCode = 200;
    const message = "Reminder Limit Reached";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REMINDER_LIMIT_REACHED_ERROR;
