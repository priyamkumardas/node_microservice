const express = require('express');
const { HttpResponseHandler, RequestHandler, Logger: log } = require('sarvm-utility');
const ShopController = require('@controllers/v1/Shop');

const router = express.Router();

const { apiServices } = require('sarvm-utility');
const { auth: { Token } } = apiServices;


const handleRequest = async (validationSchema, fn, dataValues) => {
    const data = await fn(dataValues);
    return data;
  };
  
const handleRESTReq = (fn, validationSchema) => {
return async (req, res, next) => {
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
    log.error({error: error});
    next(error);
    }
};
};

// GET /shop/manager/:shopID - get manager of the shop
router.get('/:shopId', handleRESTReq(ShopController.getAccountManagerByShopId));

//add retailerManager in the shop table
router.post('/', handleRESTReq(ShopController.addManager));

// DELETE /shop/manager/:shopID - Update manager
router.delete('/:shopId', handleRESTReq(ShopController.deleteManager));

// PUT /shop/manager/:shopID - Update manager
router.put('/:shopId', handleRESTReq(ShopController.updateShopManager));


module.exports = router;
