require('module-alias/register');

const express = require('express');
const config = require('./src/config');

const {
  Logger: log,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
} = require('sarvm-utility');

const InitApp = require('./src/InitApp');

const router = require('./src/apis/routes');

const app = express();

InitApp(app).then(() => {
  

  
  app.use(config.node.pathPrefix, router);

  // Todo: handle response with error handler
  app.use((req, res, next) => {
    next(new PAGE_NOT_FOUND_ERROR());
  });

  app.use(async (error, req, res, next) => {
    // log.error(error);
    log.error({error: error});
    try {
      if (!(error instanceof BaseError)) {
        throw new INTERNAL_SERVER_ERROR();
      } else throw error;
    } catch (err) {
      //log.error('error inside usr-mgnt-service', err);

      console.log('error inside user mgmt service', err);
      await err.handleError(req, res);
    }
  });
  

  app.listen(config.node.port, async () => {
    log.info({ msg: `Base URL: ${config.node.url}${config.node.pathPrefix}` });
  });
  // if (config.isTest) {
  //   // For unit testing
  //   module.exports = app;
  // }
});
