const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REMINDER_COUNT_UPDATE_ERROR extends BaseError {
  constructor(error) {
    const code = "REMINDER_COUNT_UPDATE_ERROR";
    const statusCode = 200;
    const message = "The reminder was send but the db wasn't updated";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = REMINDER_COUNT_UPDATE_ERROR;
