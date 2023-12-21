const phone = {
  type: ['string', 'integer'],
  pattern: '^[0-9]{10}$',
};
const otp = {
  type: ['string', 'integer'],
  pattern: '^[0-9]{4}$',
};
const sendOtp = {
  type: 'object',
  properties: {
    phone: phone,
  },
  required: ['phone'],
  additionalProperties: false,
};

const verifyOtp = {
  type: 'object',
  properties: {
    phone: phone,
    otp: otp,
  },
  required: ['phone', 'otp'],
  additionalProperties: false,
};

module.exports = { sendOtp, verifyOtp };
