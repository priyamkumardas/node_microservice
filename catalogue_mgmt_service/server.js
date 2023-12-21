require('module-alias/register');

// eslint-disable-next-line import/order
const InitApp = require('./src/InitApp');

const express = require('express');
const morgan = require('morgan');
const {
  Logger: log,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  reqFormat,
  AuthManager,
} = require('sarvm-utility');

const cors = require('cors');

const config = require('./src/config');
const router = require('./src/apis/routes');

const app = express();
InitApp(app).then(() => {
  app.use(express.json({ limit: '1mb' }));
  app.use(
    express.urlencoded({
      limit: '1mb',
      extended: true,
    }),
  );

  if (!config.isTest) {
    app.use(morgan(reqFormat));
  }

  app.use(cors());

  app.use(AuthManager.decodeAuthToken);

  app.use(config.node.pathPrefix, router);

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
});
