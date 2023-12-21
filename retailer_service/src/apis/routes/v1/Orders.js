const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const OrderController = require('@controllers/v1/Orders');
const { orderStatus, deliveryDetails, getAllOrdersSchema } = require('@root/src/common/libs/Validation/Order');
const validateDto = require('@root/src/common/libs/middleware/validate-dto');

const router = express.Router();

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

router.get('/:orderId', handleRESTReq(OrderController.getOrderById));

router.get('/admin/:shopId', handleRESTReq(OrderController.getOrders, validateDto(getAllOrdersSchema, 'query')));

router.get('/', handleRESTReq(OrderController.getOrders, validateDto(getAllOrdersSchema, 'query')));

router.put('/:orderId/status', handleRESTReq(OrderController.updateOrderStatus, validateDto(orderStatus, 'body')));

router.put('/:orderId/dispatch', handleRESTReq(OrderController.updateDeliveryStatus, validateDto(deliveryDetails, 'body')));

router.put('/:orderId/payment', handleRESTReq(OrderController.updatePaymentStatus));

router.post('/assign/:orderId', handleRESTReq(OrderController.createTripForDeliveryBoy));

router.post('/reAssign/:orderId', handleRESTReq(OrderController.updateTripForDeliveryBoy));


module.exports = router;