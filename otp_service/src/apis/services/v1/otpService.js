/* eslint-disable import/no-unresolved */
const db = require('@root/src/apis/db/mongodb');
const { encode, decodeOTP } = require('@root/src/common/libs/crypto');
const { generateOTP } = require('@root/src/common/libs/OtpGenerator/GenerateOtp');
const {
  Logger: log,
  ErrorHandler: { DB_CONNECTION_ERROR },
} = require('sarvm-utility');
const OTPOverMessage = require('./OtpMessage');

const insertOTP = async (userid, otp, retryCount = 0) => {
  log.info({info: 'OTP Service :: Inside insertOtp'})
  const obj = {
    userid,
    otp,
  };
  try {
    const { Otp } = db.getInstance();
    if (retryCount > 0) {
      await Otp.deleteMany({ userid });
      obj.retryCount = retryCount;
    }
    return await Otp.create(obj);
  } catch (err) {
    throw new DB_CONNECTION_ERROR();
  }
};

const getOTP = async (userid) => {
  log.info({info: 'OTP Service :: inside getOtp'})
  try {
    const { Otp } = db.getInstance();
    return await Otp.findOne({ userid });
  } catch (err) {
    throw new DB_CONNECTION_ERROR();
  }
};

// eslint-disable-next-line max-len
const processOTP = async (userid, retryCount, env, phoneNum, medium, inputEncodedOTP = undefined) => {
  log.info({info: 'OTP Service :: Inside process OTP'})
  try {
    const otp = inputEncodedOTP ? await decodeOTP(inputEncodedOTP) : generateOTP(env, phoneNum);
    console.log("otp is", otp)
    await OTPOverMessage.sendMessage(phoneNum, otp, medium);

    let encryptedOTP = inputEncodedOTP;
    if (!encryptedOTP) {
      encryptedOTP = await encode(`${otp}a`);
    }

    return await insertOTP(userid, encryptedOTP, retryCount);
  } catch (err) {
    log.error('error in processOTP method: %s', err);
    throw new DB_CONNECTION_ERROR();
  }
};

const deleteOTP = async (userid) => {
  log.info({info: 'Otp Service :: Inside delteOtp'})
  try {
    const { Otp } = db.getInstance();
    return await Otp.deleteMany({ userid });
  } catch (err) {
    log.error('error in deleteOTP method: %s', err);
    throw new DB_CONNECTION_ERROR();
  }
};

module.exports = {
  getOTP,
  insertOTP,
  processOTP,
  deleteOTP,
};
