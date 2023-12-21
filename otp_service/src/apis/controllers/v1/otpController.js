/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
const { decodeOTP } = require('@root/src/common/libs/crypto');
const OTPService = require('@services/v1/otpService');
const config = require('@config');
const CONSTANTS = require('@common/utility/constants');
const { Logger: log } = require('sarvm-utility');
const { sendOtpMessage } = require('@root/src/apis/producers/otpProducer');
const { OTP_NOT_MATCHED_ERROR, NULL_OTP_ERROR, RETRY_LIMIT_EXCEEDED_ERROR } = require('../../errors');

const sendOTP = async (userid, phoneNum, medium) => {
  const fromDataBase = await OTPService.getOTP(userid);
  if (fromDataBase !== null) {
    const { otp } = fromDataBase;
    let { retryCount } = fromDataBase;

    const { retryLimit } = config;
    if (Number(retryCount) >= Number(retryLimit)) {
      // throw new RETRY_LIMIT_EXCEEDED_ERROR();
      throw new RETRY_LIMIT_EXCEEDED_ERROR();
    }

    retryCount += 1;
    await OTPService.processOTP(userid, retryCount, config.env, phoneNum, medium, otp);
    return true;
  }
  await OTPService.processOTP(userid, 0, config.env, phoneNum, medium);
  return true;
};

const buildDeleteOtpRequest = (userId) => ({
  userId,
  serviceType: 'deleteOtpByUserId',
});

const sendOTPOverSMS = async ({ userId, phone }) => {
  log.info({ info: 'OTP Controller :: send Otp Over SMS' });
  try {
    await sendOTP(userId, phone, CONSTANTS.MEDIUM.SMS);
    return true;
  } catch (error) {
    log.error({ error: error });
  }
  return false;
};

const sendOTPOverCall = async ({ userId, phone }) => {
  log.info({ info: 'OTP Controller :: send Otp Over Call' });
  try {
    await sendOTP(userId, phone, CONSTANTS.MEDIUM.CALL);
    return true;
  } catch (error) {
    log.error({ error: error });
  }
  return false;
};

const verifyOTP = async ({ userId, phone, otp }) => {
  log.info({ info: 'OTP Controller :: inside verify OTP' });

  const fromDataBase = await OTPService.getOTP(userId);

  if (fromDataBase !== null) {
    const decOTP = await decodeOTP(fromDataBase.otp);
    if (decOTP === otp) {
      //sendOtpMessage(buildDeleteOtpRequest(userId));
      //sendOtpMessage()
      // no need to call send otp message here
      OTPService.deleteOTP(userId);
      return true;
    }
    throw new OTP_NOT_MATCHED_ERROR();
  }
  throw new NULL_OTP_ERROR();
};

const deleteOTPRecord = async ({ userId, phone }) => {
  log.info({ info: 'OTP Controller :: Inside delete OTP Record' });
  const fromDataBase = await OTPService.deleteOTP(userId);
  return fromDataBase;
};

module.exports = {
  sendOTPOverSMS,
  verifyOTP,
  sendOTPOverCall,
  deleteOTPRecord,
};
