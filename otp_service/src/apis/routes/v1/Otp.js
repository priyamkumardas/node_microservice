/* eslint-disable import/no-unresolved */
const express = require('express');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const OtpController = require('@controllers/v1/otpController');

// const Schemas = require('@root/src/common/libs/Validation/Schemas');
// const { validate } = require('@root/src/common/libs/Validation/Validation');
const router = express.Router();

router.post('/verifyOTP', async (req, res, next) => {
  log.info({ info: 'OTP Router :: inside verify otp router' });
  try {
    const { phone, userId, otp } = req.body;
    const data = await OtpController.verifyOTP({ userId, phone, otp });
    log.info({ info: `OTP verified successfully for number :: ${phone}` });
    HttpResponseHandler.success(req, res, true);
  } catch (error) {
    next(error);
  }
});

router.post('/sms', async (req, res, next) => {
  log.info({ info: 'OTP Router :: inside send otp over sms router' });
  try {
    const { phone, userId } = req.body;
    const data = await OtpController.sendOTPOverSMS({ userId, phone });
    log.info({ info: `OTP sent successfully over sms for number :: ${phone}` });
    HttpResponseHandler.success(req, res, {
      status: data,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/call', async (req, res, next) => {
  log.info({ info: 'OTP Router :: inside send otp over call router' });
  try {
    const { phone, userId } = req.body;
    const data = await OtpController.sendOTPOverCall({ userId, phone });
    log.info({ info: `OTP sent successfully over call for number :: ${phone}` });
    HttpResponseHandler.success(req, res, {
      status: data,
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  log.info({ info: 'OTP Router :: inside delete opt router' });
  try {
    const { userId } = req.body;
    const data = await OtpController.deleteOTPRecord({ userId });
    log.info({ info: `OTP deleted successfully for number :: ${phone}` });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
