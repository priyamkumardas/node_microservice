const { SERVER_ERROR_CODES, SERVER_ERROR_HANDLING } = require('./serverErrors');

const { OTP_ERROR_CODES, OTP_ERROR_HANDLING } = require('./otpErrors');
const { AUTH_ERROR_CODES, AUTH_ERROR_HANDLING } = require('./authErrors');

module.exports = {
  ERROR_CODES: {
    ...SERVER_ERROR_CODES,
    ...OTP_ERROR_CODES,
    ...AUTH_ERROR_CODES,
  },
  ERROR_HANDLING: {
    ...SERVER_ERROR_HANDLING,
    ...OTP_ERROR_HANDLING,
    ...AUTH_ERROR_HANDLING,
  },
};
