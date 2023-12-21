/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const CatalogController = require('@controllers/v1/catalog');
const { addCatalogSchema } = require('@root/src/common/libs/Validation/catalog');
const { validateAjv } = require('@root/src/common/libs/Middleware/validate-ajv');

const router = express.Router();

router.get('/image', async (req, res, next) => {
  log.info({ info: 'Inside presigned url' });
  try {
    const result = await CatalogController.presignedUrl();
    log.info({ info: 'presigned url' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside catalog list' });
  try {
    const query = req.query;
    const { page = 1, q, pageSize = 50 } = query;
    const filterSearch = { page, pageSize, q };
    const result = await CatalogController.catalogList(filterSearch);
    log.info({ info: 'catalog list' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/:catalog_id', async (req, res, next) => {
  log.info({ info: 'Inside catalog by id' });
  try {
    const { catalog_id } = req.params;
    const result = await CatalogController.catalogById(catalog_id);
    log.info({ info: 'catalog by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  log.info({ info: 'Inside add catalog' });
  try {
    const { name, image, description, region, tax_status } = req.body;
    const args = {
      name,
      image,
      region,
      tax_status,
      description,
    };
    validateAjv(addCatalogSchema, args);
    const { userId } = req.authPayload;
    const result = await CatalogController.addCatalog(userId, args);
    log.info({ info: 'added catalog' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.put('/:catalog_id', async (req, res, next) => {
  log.info({ info: 'Inside update catalog by id' });
  try {
    const { catalog_id } = req.params;
    const { name, image, description, region, tax_status } = req.body;
    const args = {
      name,
      image,
      region,
      tax_status,
      description,
    };
    const { userId } = req.authPayload;
    const result = await CatalogController.updateCatalogById(userId, catalog_id, args);
    log.info({ info: 'update catalog by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.delete('/:catalog_id', async (req, res, next) => {
  log.info({ info: 'Inside delete catalog by id' });
  try {
    const { catalog_id } = req.params;
    const result = await CatalogController.deleteCatalogById(catalog_id);
    log.info({ info: 'delete catalog by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
