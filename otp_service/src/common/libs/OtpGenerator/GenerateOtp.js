const CONSTANTS = require('../../utility/constants');

const generateOTP = (env, phoneNum) => {
  // if (
  //   (env === CONSTANTS.ENV.PROD && phoneNum.substring(0, 3) === CONSTANTS.PROD_DUMMY_PHONE_NUM) ||
  //   env === CONSTANTS.ENV.DEV
  // ) {
  //   return CONSTANTS.OTP.DEF_VAL;
  // }

  return Math.floor(1000 + Math.random() * 9000);
};

const sendOTP = (phone, OTP) => {};

module.exports = { generateOTP };
