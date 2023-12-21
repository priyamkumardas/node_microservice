const { SERVER_ERROR_CODES, SERVER_ERROR_HANDLING } = require("./serverErrors");

const { OTP_ERROR_CODES, OTP_ERROR_HANDLING } = require("./otpErrors");

module.exports = {
  ERROR_CODES: {
    ...SERVER_ERROR_CODES,
    ...OTP_ERROR_CODES,
  },
  ERROR_HADNLING: {
    ...SERVER_ERROR_HANDLING,
    ...OTP_ERROR_HANDLING,
  },
};
