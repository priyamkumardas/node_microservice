const express = require('express');
const { HttpResponseHandler, RequestHandler, Logger: log } = require('sarvm-utility');
const DeliveryBoyController = require('@controllers/v1/Delivery');

const router = express.Router();

const handleRequest = async (validateSchemaHandler, controllerFunction, args) => {
  // validateSchemaHandler(args);
  return await controllerFunction(args);
};

router.post('/', async (req, res, next) => {
  try {
    const { authPayload } = req;
    const { userId, shopId } = authPayload;

    const { devliveryBoyId } = req.body;
    const args = { shopId, userId, devliveryBoyId };
    const validateSchema = null; //schema is to be validated here
    const result = await handleRequest(validateSchema, DeliveryBoyController.addDeliveryBoyToShop, args);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const { authPayload } = req;
    const { userId, shopId } = authPayload;

    const args = { shopId, userId };
    const validateSchema = null; //schema is to be validated here
    const result = await handleRequest(validateSchema, DeliveryBoyController.getAllListOfAllDeliveryBoy, args);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.post('/createDeliveryBoy', async (req, res, next) => {
  try {
    const { shopId, userId } = req.authPayload;
    const args = {
      shopId,
      retailerId: userId,
      ...req.body
    }
    const validateSchema = null; //schema is to be validated here
    const result = await handleRequest(validateSchema, DeliveryBoyController.createDeliveryBoyForShop, args);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.get('/:shopId/deliveryBoys', async (req, res, next) => {
  try {
    const { shopId } = req.params;
    const validateSchema = null; //schema is to be validated here
    const result = await handleRequest(validateSchema, DeliveryBoyController.getAllDeliveryBoys, shopId);
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

module.exports = router;
