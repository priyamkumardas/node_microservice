const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class APPNAME_UNDEFINED_ERROR extends BaseError {
  constructor(error) {
    const code = "APPNAME_UNDEFINED_ERROR";
    const statusCode = 200;
    const message = "Appname is not defined for this user type";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = APPNAME_UNDEFINED_ERROR;
