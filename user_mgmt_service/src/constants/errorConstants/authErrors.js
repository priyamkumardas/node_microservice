const AUTH_ERROR_CODES = {
  ACCESSTOKEN_EXP_ERROR: 'ACCESSTOKEN_EXP_ERROR',
  REFRESHTOKEN_EXP_ERROR: 'REFRESHTOKEN_EXP_ERROR',
  UNAUTH_USER: 'UNAUTH_USER',
};

const AUTH_ERROR_HANDLING = {
  [AUTH_ERROR_CODES.ACCESSTOKEN_EXP_ERROR]: {
    msg: 'Access Token expired',
    statusCode: 200,
  },
  [AUTH_ERROR_CODES.REFRESHTOKEN_EXP_ERROR]: {
    msg: 'Refresh token expired',
    statusCode: 200,
  },
  [AUTH_ERROR_CODES.UNAUTH_USER]: {
    msg: 'unauthenticated access deteceted',
    statusCode: 200,
  },
};

module.exports = { AUTH_ERROR_CODES, AUTH_ERROR_HANDLING };
