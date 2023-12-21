require('module-alias/register');

// eslint-disable-next-line import/order
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const {
  Logger,
  ReqLogger,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  reqFormat,
  AuthManager,
} = require('sarvm-utility');

const { createProxyMiddleware } = require('http-proxy-middleware');
//const { Logger, ErrorHandler, reqFormat } = require('sarvm-utility');

//const { PAGE_NOT_FOUND_ERROR } = ErrorHandler;

//const { AuthManager } = require('@common/libs');
const { AuthController } = require('@controllers/v1');
const InitApp = require('./src/InitApp');

const router = require('./src/apis/routes');
const config = require('./src/config');
const app = express();

InitApp(app).then(() => {
  // app.use(express.json({ limit: '1mb' }));
  app.use(
    express.urlencoded({
      limit: '1mb',
      extended: true,
    }),
  );

  app.use(cors());

  app.use(AuthManager.decodeAuthToken);

  // if (!config.isTest) {
  //   app.use(morgan(reqFormat));
  // }
  app.use(ReqLogger);

  app.use(config.node.pathPrefix, router);

  const options = {
    target: config.url.INTERNAL_LOAD_BALANCER,
    changeOrigin: true, // needed for virtual hosted sites
    ws: true, // proxy websockets
  };

  app.use('/whs', createProxyMiddleware(options));
  app.all(
    '*',
    async (req, res, next) => {
      try {
        const dataValues = {
          headers: req.headers,
          path: req.path,
          body: req.body,
        };
        await AuthController.verifyToken(dataValues);
        next();
      } catch (error) {
        next(error);
      }
    },
    createProxyMiddleware(options),
  );

  // Todo: handle response with error handler
  app.use((req, res, next) => {
    next(new PAGE_NOT_FOUND_ERROR());
  });

  app.use(async (error, req, res, next) => {
    // logger.info(error);
    try {
      if (!(error instanceof BaseError)) {
        throw new INTERNAL_SERVER_ERROR();
      } else throw error;
    } catch (err) {
      await err.handleError(req, res);
    }
  });
  process.on('uncaughtException', (err) => Logger.info(err));
  const server = app.listen(config.node.port, () => {
    Logger.info(`Base URL: ${config.node.url}${config.node.pathPrefix}`);
  });

  // if (config.isTest) {
  //   // For unit testing
  //   module.exports = app;
  // }
});
