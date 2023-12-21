const Db = require('@db');

const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const IP = require('ip');
const config = require('../config');
const cuid = require('cuid');
const _ = require('lodash');
const createNamespace = require('cls-hooked').createNamespace;
const sessionName = config.sessionName;
const session = createNamespace(sessionName);

const {
  Logger: log,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  ReqLogger,
  reqFormat,
  AuthManager,
} = require('sarvm-utility');



const init = async (app) => {
  app.use(AuthManager.decodeAuthToken);

  app.use((req, res, next) => {
    session.run(() => {
      res.locals.sessionId = _.isUndefined(req.headers.sessionid) ? cuid() : req.headers.sessionid;

      try {
        res.locals.clientIp = _.isUndefined(req.headers.clientip)
          ? _.get(req, 'headers.x-forwarded-for', _.get(req, 'headers.X-Forwarded-For', IP.address()))
          : req.headers.clientip;
      } catch (err) {
        console.log(err);
      }

      session.set('sessionId', res.locals.sessionId);
      session.set('clientIp', res.locals.clientIp);
      next();
    });
  });

  app.use(express.json({ limit: '1mb' }));
  app.use(
    express.urlencoded({
      limit: '1mb',
      extended: true,
    }),
  );
  app.use(cors());
  
  if (!config.isTest) {
    app.use(ReqLogger);
  }

  


  const mongoConnection = new Db();
  mongoConnection.connect();

  // Unhandled Rejections and Exceptions process wide
  process
    .on('unhandledRejection', (reason) => {
      console.log("unhandled rejection is", reason);
      log.error({ 'Unhandled Rejection at Promise:': reason });
    })
    .on('uncaughtException', (error) => {
      console.log("uncaught exception is", error )
      log.error({ 'Uncaught Exception thrown:': error });
      process.exit(1);
    });
};

module.exports = init;
