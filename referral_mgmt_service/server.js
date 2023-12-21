'use strict';
const allowedEnvironments = ['stg', 'prod', 'dev'];

if (allowedEnvironments.includes(process.env.ENV)) {
  const apm = require('elastic-apm-node').start({
    serviceName: process.env.HOST_SERVICE_NAME,
    serverUrl: process.env.ELASTIC_APM_SERVER_URL,
    environment: process.env.ENV,
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
    captureErrorLogStackTraces: true,
    captureExceptions: true,
    transactionSampleRate: 1.0,
  });
}

require('module-alias/register');

// eslint-disable-next-line import/order
const InitApp = require('./src/InitApp');

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const IP = require('ip');
const config = require('./src/config');
const cuid = require('cuid');
const _ = require('lodash');
const createNamespace = require('cls-hooked').createNamespace;
const sessionName = config.session_name;
const session = createNamespace(sessionName);

const router = require('./src/apis/routes');

const {
  Logger: log,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  reqFormat,
  AuthManager,
} = require('sarvm-utility');

const { validationErrorMiddleware } = require('./src/common/libs/Validation/Validation');

const app = express();
InitApp(app).then(() => {
  app.use(express.json({ limit: '1mb' }));
  app.use(
    express.urlencoded({
      limit: '1mb',
      extended: true,
    })
  );

  app.use(cors());

  if (!config.isTest) {
    app.use(morgan(reqFormat));
  }
  app.use(AuthManager.decodeAuthToken);

  app.use((req, res, next) => {
    session.run(() => {
      res.locals.sessionId = _.isUndefined(req.headers.sessionid) ? cuid() : req.headers.sessionid;

      try {
        res.locals.clientIp = _.isUndefined(req.headers.clientip)
          ? _.get(
              req,
              'headers.x-forwarded-for',
              _.get(req, 'headers.X-Forwarded-For', IP.address())
            )
          : req.headers.clientip;
      } catch (err) {
        console.log(err);
      }

      session.set('sessionId', res.locals.sessionId);
      session.set('clientIp', res.locals.clientIp);
      next();
    });
  });

  app.use(config.node.pathPrefix, router);

  app.use(validationErrorMiddleware);

  // Todo: handle response with error handler
  app.use((req, res, next) => {
    next(new PAGE_NOT_FOUND_ERROR());
  });

  app.use(async (error, req, res, next) => {
    try {
      if (!(error instanceof BaseError)) {
        throw new INTERNAL_SERVER_ERROR();
      } else throw error;
    } catch (err) {
      await err.handleError(req, res);
    }
  });

  const server = app.listen(config.node.port, () => {
    log.info({ msg: `Base URL: ${config.node.url}${config.node.pathPrefix}` });
  });

  // if (config.isTest) {
  //   // For unit testing
  //   module.exports = app;
  // }
});
