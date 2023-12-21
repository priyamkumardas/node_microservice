const express = require('express');

const { HttpResponseHandler, Logger } = require('sarvm-utility');
const { AuthController } = require('@controllers/v1');

const handleRequest = async (validationSchema, fn, dataValues) => {
  // validation on validation schema
  const data = await fn(dataValues);
  return data;
};

const handleRESTReq = (fn, validationSchema) => {
  return async (req, res, next) => {
    try {
      const { app_name, app_version_code, authorization } = req.headers;
      const restBody = req.body;
      const restParams = req.params;
      const restQuery = req.query;
      // const restPath = req.path;
      const user = req.authPayload;
      const dataValues = {
        app_version_code,
        app_name,
        authorization,
        user,
        // restPath,
        ...restParams,
        ...restBody,
        ...restQuery,
      };
      const data = await handleRequest(validationSchema, fn, dataValues);
      HttpResponseHandler.success(req, res, data);
    } catch (error) {
      Logger.info(error);
      next(error);
    }
  };
};

const router = express.Router();

router.get('/token/:userId', handleRESTReq(AuthController.getToken));

router.post('/token', handleRESTReq(AuthController.generateToken));

router.get('/unauth_token', handleRESTReq(AuthController.getUnauthorizeToken));

module.exports = router;
