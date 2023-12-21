const { Logger: log } = require('sarvm-utility');
const HttpResponseHandler = require('../HttpResponseHandler');

// const { handleNodeError } = require('./handleNodeError');
const { ERROR_HADNLING } = require('../../../constants');

const { requestToCurl } = require('./reqToCurl');

class AppError extends Error {
  constructor(errorCode, originalErr = null, errData = null) {
    super();
    this.errorCode = errorCode;
    this.originalErr = originalErr;
    this.errData = errData;
  }

  static async handleError(error, req, res) {
    if (error instanceof AppError) {
    } else {
      const errMsg = 'Server Error (Unhandled)';
      let statusCode = 500;
      const errObj = {};

      const { errorCode, originalErr, errData } = error;
      if (errorCode) {
        errObj.code = errorCode;
        errObj.message = ERROR_HADNLING[errorCode].msg;
        statusCode = ERROR_HADNLING[errorCode].statusCode;
      } else {
        errObj.message = errMsg;
        errObj.code = statusCode;
      }

      const curl = requestToCurl(req);

      log.error({
        error: {
          url: req.url,
          errorCode,
          errMsg,
          statusCode,
          originalErr: originalErr?.message,
          errData,
          // userGUID,
          curl,
        },
        error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
      });
      // Todo: error is nearly duplicated in case of original error
      HttpResponseHandler.error(req, res, errObj, statusCode);
      // await fireMonitoringMetric(error);
      // await crashIfUntrustedErrorOrSendResponse(error, responseStream);
    }
  }
}

module.exports = AppError;
