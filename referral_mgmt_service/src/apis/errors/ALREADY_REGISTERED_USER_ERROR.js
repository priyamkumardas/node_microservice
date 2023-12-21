const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class ALREADY_REGISTERED_USER_ERROR extends BaseError {
  constructor(error) {
    const code = "ALREADY_REGISTERED_USER_ERROR";
    const statusCode = 200;
    const message = "The user is already registered";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = ALREADY_REGISTERED_USER_ERROR;
