const errorConstants = require('./errorConstants');

module.exports = Object.freeze({
  ...errorConstants,
  EVENT_TYPES: {
    SENT_OTP_OVER_SMS: 'sentOtpOverSms',
    SENT_OTP_OVER_CALL: 'sentOtpOverCall',
    DELETE_OTP_BY_USER_ID: 'deleteOtpByUserId',
  },
});
