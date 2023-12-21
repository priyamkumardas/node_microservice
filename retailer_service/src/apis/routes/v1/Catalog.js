/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const CatalogController = require('@root/src/apis/controllers/v1/Catalog');
const validateDto = require('@root/src/common/libs/middleware/validate-dto');
const { catalog } = require('@root/src/common/libs/Validation/Catalog');
const VerifyRouter = require('./Verifycatalog');

const router = express.Router();

router.use('/verify', VerifyRouter);

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
      log.error({ error: error });
      next(error);
    }
  };
};

router.get('/', handleRESTReq(CatalogController.getCatalog));

router.get('/:shopid', handleRESTReq(CatalogController.getProduct));

router.put('/:shopid', handleRESTReq(CatalogController.updateProduct));

router.post('/:shopId', handleRESTReq(CatalogController.updateBulkProduct));

module.exports = router;
