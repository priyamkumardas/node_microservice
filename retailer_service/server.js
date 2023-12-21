/* eslint-disable object-curly-newline */
/* eslint-disable lines-around-directive */
// eslint-disable-next-line strict
'use strict';
const config = require('./src/config');

const allowedEnvironments = ['stg', 'prod', 'dev'];

// if (allowedEnvironments.includes(process.env.ENV)) {
//   const apm = require('elastic-apm-node').start({
//     serviceName: process.env.HOST_SERVICE_NAME,
//     serverUrl: process.env.ELASTIC_APM_SERVER_URL,
//     environment: process.env.ENV,
//     logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
//     captureErrorLogStackTraces: true,
//     captureExceptions: true,
//     transactionSampleRate: 1.0,
//   });
// }

require('module-alias/register');

// eslint-disable-next-line import/order
const InitApp = require('./src/InitApp');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const {
  Logger,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  reqFormat,
  AuthManager,
} = require('sarvm-utility');

//const { Logger, ErrorHandler, reqFormat, AuthManager } = require('sarvm-utility');

const router = require('./src/apis/routes');

//const { PAGE_NOT_FOUND_ERROR } = ErrorHandler;

const app = express();
InitApp(app).then(() => {
  //const logger = Logger.getInstance();

  app.use(config.node.pathPrefix, router);
  // Todo: handle response with error handler
  app.use((req, res, next) => {
    Logger.error({ error: ' PAGE_NOT_FOUND_ERROR' });
    next(new PAGE_NOT_FOUND_ERROR());
  });

  app.use(async (error, req, res, next) => {
    // logger.info(error);
    console.log('error is', error);
    try {
      if (!(error instanceof BaseError)) {
        Logger.error({ error: error });
        throw new INTERNAL_SERVER_ERROR();
      } else throw error;
    } catch (err) {
      Logger.error({ error: err });
      await err.handleError(req, res);
    }
  });
  // eslint-disable-next-line no-unused-vars
  const server = app.listen(config.node.port, () => {
    Logger.info({ msg: `Base URL: http://${config.node.host}:${config.node.port}${config.node.pathPrefix}` });
  });

  // if (config.isTest) {
  //   // For unit testing
  //   module.exports = app;
  // }
});
