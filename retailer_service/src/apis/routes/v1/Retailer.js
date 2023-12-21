/* eslint-disable import/no-unresolved */
const express = require('express');
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const RetailerController = require('@controllers/v1/Retailer');

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
    log.error({ error: error });
    next(error);
  }
};

const router = express.Router();

router.get('/getAllRetailers', handleRESTReq(RetailerController.getAllRetailer));

router.post('/:userId/paymentInfo', handleRESTReq(RetailerController.addRetailer));

router.put('/:r_id/paymentInfo/:payment_info_id', handleRESTReq(RetailerController.updateRetailer));

router.get('/:userId/paymentInfo', handleRESTReq(RetailerController.getRetailer));

router.delete('/:r_id/paymentInfo/:payment_info_id', handleRESTReq(RetailerController.deletePaymentApp));

module.exports = router;
