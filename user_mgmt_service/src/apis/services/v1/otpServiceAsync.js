const { env, systemToken } = require('@config');

const {
  Logger: log,
  ErrorHandler: { SEND_OTP_ERROR, VERIFY_OTP_ERROR },
  apiServices: { otp: otpAPIService },
} = require('sarvm-utility');

const { OtpService } = require('@services/v1');
const { ENV, MEDIUM } = require('@root/src/common/utility/constants');

const sendOtpAsync = async ({ args, medium, headers }) => {
  log.info('inside service::sendOtpAsync method');
  const { phone, userId } = args;

  if (env === ENV.DEV) {
    return true;
  }

  const body = JSON.stringify({
    phone,
    userId,
  });

  const newHeaders = {
    Authorization: `systemToken ${systemToken}`,
    'Content-Type': 'application/json',
  };

  if (medium === MEDIUM.CALL) {
    const { status } = await otpAPIService.sendOTPOverCall({ headers: newHeaders, body });
    return status;
  } // else if (medium === MEDIUM.SMS) {
  const { status } = await otpAPIService.sendOTPOverSms({ headers: newHeaders, body });
  return status;
};

// const verifyOTPAsync = async ({ phone, otp, userId, headers }) => {
//   log.info('inside service::verifyOTPAsync method');

//   if (env !== ENV.DEV) {
//     const isOtpVerified = await OtpService.verifyOTP({
//       otp,
//       phone,
//       userId,
//       headers,
//     });
//     return isOtpVerified;
//   }

//   const body = JSON.stringify({
//     phone,
//     otp,
//     userId,
//   });
//   const { authorization } = headers;
//   const newHeaders = {
//     Authorization: `systemToken ${systemToken}`,
//     'Content-Type': 'application/json',
//   };

//   const { status } = await otpAPIService.verifyOTP({ headers: newHeaders, body });
//   return status;
// };

module.exports = {
  sendOtpAsync,
  // verifyOTPAsync,
};
