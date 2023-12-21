const {
  ErrorHandler: { BaseError },
} = require("sarvm-utility");

class REWARD_READ_ERROR extends BaseError {
  constructor(error) {
    const code = "REWARD_UPDATE_ERROR";
    const statusCode = 200;
    const message = "Error occured during reading the reward collection";
    const key = "ref_ms";
    super({ code, statusCode, message, key, error });
  }
}

module.exports = REWARD_READ_ERROR;
