const sendOTPSchema = {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
      pattern:'^[0-9]{10}$',
    },
  },
  required: ['phone'],
  additionalProperties: true,
};

const verifyOTPSchema = {
  type: 'object',
  properties: {
    phone: {
      type: 'string',
      pattern:'^[0-9]{10}$',
    },
    otp: {
      type: 'string',
      pattern:'^[0-9]{4}'
      ,
    },
  },
  required: ['phone','otp'],
  additionalProperties: true,
};

module.exports = {
  sendOTPSchema,
  verifyOTPSchema,
};
