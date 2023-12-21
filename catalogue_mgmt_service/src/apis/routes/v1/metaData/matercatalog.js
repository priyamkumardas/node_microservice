const express = require('express');

const router = express.Router();

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const MatereCatalogController = require('@controllers/v1/mataData/masterCatalog');
const retailerCatalogUpdateController = require('@controllers/v1/mataData/retailerCatalogUpdateController');
router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside get master catalog' });
  try {
    const result = await MatereCatalogController.getMasterCatalog();
    log.info({ info: 'get master catalog' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  log.info({ info: 'Inside add catalog' });
  try {
    const { url } = req.body;
    const { userId } = req.authPayload;
    const args = {
      url,
      userId,
    };
    const result = await MatereCatalogController.addCatalog(args);
    log.info({ info: 'add catalog' });

    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/updateRetailerCatalog', async (req, res, next) => {
  log.info({ info: 'Inside update retailer catalog' });
  try {
    const result = await retailerCatalogUpdateController.updateRetailerCatalog();
    log.info({ info: 'update retailer catalog' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
