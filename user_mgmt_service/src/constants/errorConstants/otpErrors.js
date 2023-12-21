const OTP_ERROR_CODES = {
  SEND_OTP_ERROR: 'SEND_OTP_ERROR',
  VERIFY_OTP_ERROR: 'VERIFY_OTP_ERROR',
};

const OTP_ERROR_HANDLING = {
  [OTP_ERROR_CODES.SEND_OTP_ERROR]: {
    msg: 'Unable to send OTP',
    statusCode: 200,
  },
  [OTP_ERROR_CODES.VERIFY_OTP_ERROR]: {
    msg: 'Invalid OTP',
    statusCode: 200,
  },
};

module.exports = { OTP_ERROR_CODES, OTP_ERROR_HANDLING };
