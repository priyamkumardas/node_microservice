const {
    ErrorHandler: { BaseError },
} = require("sarvm-utility");

class RATINGS_UPDATE_ERROR extends BaseError {
    constructor(error) {
        const code = "RATINGS_UPDATE_ERROR";
        const statusCode = 200;
        const message =
            "Comments could not get updated";
        const key = "ref_ms";
        super({ code, statusCode, message, key, error });
    }
}

module.exports = RATINGS_UPDATE_ERROR;
