/* eslint-disable import/no-unresolved */
const express = require('express');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const ShopController = require('@controllers/v2/Shop');

const router = express.Router();

const { requestHandler } = require('@common/utility');
const Shop = require('@root/src/apis/models/Shop');

const handleRequest = async (validationSchema, fn, dataValues) => {
  // validate dataValues with validation Schema
  const data = await fn(dataValues);
  return data;
};

const handleRESTReq = (fn, validationSchema) => async (req, res, next) => {
  try {
    const restHeader = req.headers;
    const restBody = req.body;
    const restParams = req.params;
    const restQuery = req.query;
    // const restPath = req.path;
    const user = req.authPayload;
    const dataValues = {
      user,
      ...restHeader,
      ...restParams,
      ...restBody,
      ...restQuery,
    };
    const data = await handleRequest(validationSchema, fn, dataValues);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error});
    next(error);
  }
};

router.get('/:shopId', handleRESTReq(ShopController.showShopDetailsByShopId));


module.exports = router;
