/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const productCatgoryController = require('@controllers/v1/ProductCategory');

const router = express.Router();

router.get('/:product_id', async (req, res, next) => {
  log.info({ info: 'Inside get product mapping' });
  try {
    const { product_id } = req.params;
    const result = await productCatgoryController.getProductMapping(product_id);
    log.info({ info: 'get product mapping' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/:product_id', async (req, res, next) => {
  log.info({ info: 'Inside add product mapping' });
  try {
    const { product_id } = req.params;
    const { categories } = req.body;
    const { userId } = req.authPayload;
    const result = await productCatgoryController.addProductMapping(product_id, userId, categories);
    log.info({ info: 'add product mapping' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
