const errorConstants = require('./errorConstants');

const SH = 'SH';
const SSO = 'SSO';
const CO = 'CO';
const empRoles = { SH, SSO, CO };

const ACTIVE = 'ACTIVE';
const INACTIVE = 'INACTIVE';
const userStatus = { ACTIVE, INACTIVE };
const DEFUALT_LAT = 0.0;
const DEFAULT_LON = 0.0
const defaultLocation = { DEFAULT_LON, DEFUALT_LAT }
module.exports = Object.freeze({
  ...errorConstants,
  empRoles,
  userStatus,
  EVENT_TYPES: {
    SENT_OTP_OVER_SMS: 'sentOtpOverSms',
    SENT_OTP_OVER_CALL: 'sentOtpOverCall',
    DELETE_OTP_BY_USER_ID: 'deleteOtpByUserId',
  },
  defaultLocation
});
