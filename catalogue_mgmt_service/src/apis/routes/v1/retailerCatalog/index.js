const express = require('express');

const router = express.Router();
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const RetailerCatalogController = require('@controllers/v1/retailerCatalog/index');

router.post('/', async (req, res, next) => {
  log.info({ info: 'Inside generate retailer catalog' });
  try {
    const { retailerCatalogURL, masterCatalogURL } = req.body;
    const args = {
      retailerCatalogURL,
      masterCatalogURL,
    };
    const result = await RetailerCatalogController.generateRetailerCatalog(args);
    log.info({ info: 'generate retailer catalog' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
