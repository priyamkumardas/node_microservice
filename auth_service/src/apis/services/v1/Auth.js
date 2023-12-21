const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require('sarvm-utility');

const { AuthManager } = require('@common/libs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const issueToken = async (payload) => {
  try {
    const authResult = await AuthManager.issueTokens(payload);
    return authResult;
  } catch (err) {
    Logger.error({error: err});
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

// functionalities needs to discussed once with sushant
const verifyToken = async (token) => {
  try {
    const verifyResult = await AuthManager.verifyToken(token);
    return verifyResult;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

module.exports = {
  verifyToken,
  issueToken,
};
