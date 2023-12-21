const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const LoginController = require('@controllers/v1/otpController');
const { sendOTPSchema, verifyOTPSchema } = require('@common/libs/Validation');
const { MEDIUM } = require('@common/utility/constants');

const router = express.Router();

const { requestHandler } = require('@common/utility');
const { UsersController } = require('../../controllers/v1');
const { defaultLocation } = require('@root/src/constants');

/**
 * This route calls otp Service & returns otp on phoneNumber
 * If user does not do exists for mentioned phoneNumber, it creates a user
 * else it doesn't do anything with user document
 */
router.post('/send_otp/call', async (req, res, next) => {
  log.info({ info: 'Inside Send Otp Over SMS Call ' });
  try {
    const { app_version_code, app_name, authorization } = req.headers;
    const headers = { app_version_code, app_name, authorization };
    const { phone } = req.body;
    const args = { phone, headers, medium: MEDIUM.CALL };
    const validateSchema = sendOTPSchema; //it is to be validated
    await requestHandler(validateSchema, LoginController.processToSendOtp, args);
    log.info({ info: `Otp Sent Over Call to Number ${phone}` });
    HttpResponseHandler.success(req, res);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/send_otp/sms', async (req, res, next) => {
  log.info({ info: 'Inside Send Otp Over SMS Router' });
  try {
    const { app_version_code, app_name, authorization } = req.headers;
    const headers = { app_version_code, app_name, authorization };
    const { phone } = req.body;
    const args = { phone, headers, medium: MEDIUM.SMS };
    const validateSchema = sendOTPSchema; //it is to be validated
    const data = await requestHandler(validateSchema, LoginController.processToSendOtp, args);
    log.info({ info: `Otp Sent Over SMS to Number ${phone}` });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    console.log(error);
    log.error({ error: error });
    next(error);
  }
});

/**
 * This route calls otp Service & for verification of otp
 * It updates IsOtpVerified to true for given app_name
 * also it returns IsNewUser flag
 * if IsNewUser && IsOtpverfied => calls referral_mgmt_service for signup
 * It calls auth_service: /token/:userId => returns userId, accessToken, refreshToken, phone
 */
router.post('/verify_otp', async (req, res, next) => {
  log.info({ info: 'Otp Router :: Inside Verify Otp' });
  try {
    const { app_version_code, app_name, authorization } = req.headers;

    let { lat, lon } = req.headers;
    lat = lat === undefined ? defaultLocation.DEFUALT_LAT : lat;
    lon = lon === undefined ? defaultLocation.DEFAULT_LON : lon;
    const headers = { app_version_code, app_name, authorization, lat, lon };

    const { phone, otp, deviceId, fcmToken, referredBy, type } = req.body;
    const args = {
      phone,
      otp,
      deviceId,
      fcmToken,
      headers,
      referredBy,
      type,
    };
    const validateSchema = verifyOTPSchema; //it is to be validated
    const data = await requestHandler(validateSchema, LoginController.verifyOTP, args);
    log.info({ info: `Otp Router :: Otp Verified` });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    console.log('error is', error);
    log.error({ error: error });
    next(error);
  }
});

/**
 * This route checks if phoneNumber is registered for particular app_name
 */
router.post('/check_if_reg', async (req, res, next) => {
  try {
    const { app_version_code, app_name } = req.headers;
    const { phone } = req.body;
    const args = {
      phone,
      app_version_code,
      app_name,
    };
    const validateSchema = null; //it is to be validated
    const data = await requestHandler(validateSchema, LoginController.checkIfRegistered, args);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
