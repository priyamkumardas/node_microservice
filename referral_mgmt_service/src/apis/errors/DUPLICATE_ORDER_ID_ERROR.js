const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class DUPLICATE_ORDER_ID_ERROR extends BaseError {
  constructor(error) {
    const code = "DUPLICATE_ORDER_ID_ERROR";
    const statusCode = 200;
    const message = "Duplicate order Ids not allowed";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}
module.exports = DUPLICATE_ORDER_ID_ERROR;
