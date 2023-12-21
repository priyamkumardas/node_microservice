const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REMINDER_COUNT_READ_ERROR extends BaseError {
  constructor(error) {
    const code = "REMINDER_COUNT_READ_ERROR";
    const statusCode = 200;
    const message =
      "The reminder count could not be fetched. Probably invite was never sent to this user.";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REMINDER_COUNT_READ_ERROR;
