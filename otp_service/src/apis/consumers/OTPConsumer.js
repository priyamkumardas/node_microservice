const { sendOTPOverSMS, sendOTPOverCall } = require('@controllers/v1/otpController');
const { deleteOTP } = require('@services/v1/otpService');
const { Logger: log } = require('sarvm-utility');
const {
  EVENT_TYPES: { SENT_OTP_OVER_SMS, SENT_OTP_OVER_CALL, DELETE_OTP_BY_USER_ID },
} = require('@constants');

const otpEvents = {
  [SENT_OTP_OVER_SMS]: [sendOTPOverSMS],
  [SENT_OTP_OVER_CALL]: [sendOTPOverCall],
  [DELETE_OTP_BY_USER_ID]: [deleteOTP],
};

const handleRequest = async (validationSchema, fn, dataValues) => {
  // validation on validation schema
  const data = await fn(dataValues);
  return data;
};

const handleConsumerReq = (message, events) => {
  try {
    const event = JSON.parse(message.Body);
    const { eventType, ...data } = event;

    if (!events[eventType]) {
      log.info('hello');
      throw new Error();
    }

    const [handler, validationSchema] = events[eventType];

    handleRequest(validationSchema, handler, data);
  } catch (error) {
    console.log(error);
  }
};

const handleOTPConsumerReq = (message) => handleConsumerReq(message, otpEvents);

module.exports = {
  handleOTPConsumerReq,
};
