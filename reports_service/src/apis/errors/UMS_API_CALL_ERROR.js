const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class UMS_API_CALL_ERROR extends BaseError {
  constructor(error) {
    const code = "UMS_API_CALL_ERROR";
    const statusCode = 200;
    const message = "Error occured during making API call to user management";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = UMS_API_CALL_ERROR;
