/* eslint-disable import/no-unresolved */

const { env, systemToken } = require('@config');
const CONSTANTS = require('@common/utility/constants');

const {
  apiServices: { ms: msAPIService },
} = require('sarvm-utility');

const { SEND_OTP_ERROR } = require('../../errors');

const sendMessage = async (phone, otp, medium) => {
  console.log({info: 'Otp Message Service :: Inside sendMessage function'})
  try {
    if (CONSTANTS.ENV.DEV === env) {
      return true;
    }

    const body = JSON.stringify({
      phone,
      otp,
    });
    const headers = {
      Authorization: `systemToken ${systemToken}`,
      'Content-Type': 'application/json',
    };

    let response = false;
    switch (medium) {
      case CONSTANTS.MEDIUM.SMS:
        response = await msAPIService.sms({ headers, body });
        break;
      case CONSTANTS.MEDIUM.CALL:
        response = await msAPIService.call({ headers, body });
        break;
      default:
        response = true;
    }
    if (response.success === true) {
      return true;
    }
  } catch (error) {
    throw new SEND_OTP_ERROR('unable to send message from ms_service');
  }
  return false;
};

module.exports = { sendMessage };
