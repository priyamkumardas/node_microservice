/* eslint-disable import/no-unresolved */
const express = require('express');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const ShopController = require('@controllers/v1/Shop');

const ShopMetaDataController = require('@controllers/v1/ShopMetaData');

const ShopSchemas = require('@root/src/common/libs/Validation/Shop');

const validateDto = require('@root/src/common/libs/middleware/validate-dto');

const DeliveryBoyRouter = require('./DeliveryBoy');
const retailerManager = require('./ShopAccountManager');

const router = express.Router();

const { apiServices } = require('sarvm-utility');

const { SHOP_NOT_FOUND_ERROR } = require('../../../errors/Shop');

const {
  auth: { Token },
} = apiServices;

router.use('/manager', retailerManager);
router.use('/delivery', DeliveryBoyRouter);

const handleRequest = async (validationSchema, fn, dataValues) => {
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
      // restPath,
      ...restHeader,
      ...restParams,
      ...restBody,
      ...restQuery,
    };
    const data = await handleRequest(validationSchema, fn, dataValues);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({ Error: error });
    next(error);
  }
};

router.get('/QRcodeImage', handleRESTReq(ShopController.presignedUrl));
router.get('/users/:userId', handleRESTReq(ShopController.getAllShopDetails));

router.put('/:shopId', handleRESTReq(ShopController.updateShopDetails));

router.post('/', handleRESTReq(ShopController.addShop));

router.get('/', handleRESTReq(ShopController.getAllShop));

router.get('/shopCount', handleRESTReq(ShopController.getShopCount));

router.delete('/:shopId', handleRESTReq(ShopController.deleteShop));

router.get('/:shopId', handleRESTReq(ShopMetaDataController.getShopMetaData));

router.get('/all', handleRESTReq(ShopController.shopLists));

router.get('/details/:shopId', handleRESTReq(ShopController.showShopDetailsByShopId));

router.get('/:shopId', handleRESTReq(ShopController.showShopDetailsByShopId));

router.get('/shopDetails/:id', handleRESTReq(ShopController.getShopDetailsByUniqueId));

router.get('/retailerAndShop/:retailerId', handleRESTReq(ShopController.getShopAndRetailerDetails));

router.put('/update/manager', handleRESTReq(ShopController.updateManager));

router.post(
  '/:shopId/subscription/status',
  handleRESTReq(ShopController.subscriptionStatus, validateDto(ShopSchemas.subscription, 'body')),
);

router.post('/:shopId/kyc/status', handleRESTReq(ShopController.kycStatus, validateDto(ShopSchemas.kycStatus, 'body')));

router.post('/:shopId/gst', handleRESTReq(ShopController.updateGstNumber, validateDto(ShopSchemas.gstNo, 'body')));

router.get('/:shopId/gst', handleRESTReq(ShopController.gstNumber));

router.patch('/dummySubscription', handleRESTReq(ShopController.updateDummySub));

router.put('/updateProfileJSON/:shopId', handleRESTReq(ShopController.updateProfileJSON));

router.put('/shopStatus/:userId', handleRESTReq(ShopController.updateShopStatus));

module.exports = router;
