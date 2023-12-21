const {
  Logger,
  ErrorHandler: { BaseError, INTERNAL_SERVER_ERROR, PAGE_NOT_FOUND_ERROR },
  ReqLogger,
  AuthManager,
} = require('sarvm-utility');
const express = require('express');
const cors = require('cors');
const IP = require('ip');
const cuid = require('cuid');
const _ = require('lodash');
const createNamespace = require('cls-hooked').createNamespace;
const config = require('../config');
const sessionName = config.session_name;
const session = createNamespace(sessionName);

const DB = require('@db');

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

  // app.use(express.json({ limit: "1mb" }));
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
  const mongoConnection = new DB();
  mongoConnection.connect();

  // Unhandled Rejections and Exceptions process wide
  process
    .on('unhandledRejection', (reason) => {
      Logger.error({ 'Unhandled Rejection at Promise:': reason });
    })
    .on('uncaughtException', (error) => {
      Logger.error({ 'Uncaught Exception thrown:': error });
      process.exit(1);
    });
};

module.exports = init;
