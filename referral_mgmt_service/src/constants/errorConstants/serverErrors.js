const SERVER_ERROR_CODES = {
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  PAGE_NOT_FOUND_ERROR: "PAGE_NOT_FOUND_ERROR",
  DEBUG_ERROR: "DEBUG_ERROR",
  BAD_REQUEST_ERROR: "BAD_REQUEST_ERROR",
};

const SERVER_ERROR_HANDLING = {
  [SERVER_ERROR_CODES.INTERNAL_SERVER_ERROR]: {
    msg: "Internal Server Error",
    statusCode: 500,
  },
  [SERVER_ERROR_CODES.PAGE_NOT_FOUND_ERROR]: {
    msg: "Page not found",
    statusCode: 404,
  },
  [SERVER_ERROR_CODES.BAD_REQUEST_ERROR]: {
    msg: "Bad request",
    statusCode: 400,
  },
  [SERVER_ERROR_CODES.DEBUG_ERROR]: {
    msg: "Internal Server Error | Custom",
    statusCode: 500,
  },
};

module.exports = { SERVER_ERROR_CODES, SERVER_ERROR_HANDLING };
