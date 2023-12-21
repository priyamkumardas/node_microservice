const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class STORY_READ_ERROR extends BaseError {
  constructor(error) {
    const code = "STORY_READ_ERROR";
    const statusCode = 200;
    const message = "Error fetching data from DB";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = STORY_READ_ERROR;
