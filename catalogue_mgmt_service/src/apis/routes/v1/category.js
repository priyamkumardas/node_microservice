/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const CategoryController = require('@controllers/v1/category');
const { validateAjv } = require('@root/src/common/libs/Middleware/validate-ajv');
const CategorySchema = require('@root/src/common/libs/Validation/Category/Schemas');

const router = express.Router();

router.get('/image', async (req, res, next) => {
  log.info({ info: 'Inside presigned url' });
  try {
    const result = await CategoryController.presignedUrl();
    log.info({ info: 'presigned url' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside category list' });
  try {
    const query = req.query;
    const { page = 1, q, pageSize = 50 } = query;
    const filterSearch = { page, pageSize, q };
    const result = await CategoryController.categoryLists(filterSearch);
    log.info({ info: 'category list' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.get('/:category_id', async (req, res, next) => {
  log.info({ info: 'Inside category by id' });
  try {
    const { category_id } = req.params;
    const result = await CategoryController.categoryById(category_id);
    log.info({ info: 'category by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  log.info({ info: 'Inside create category' });
  try {
    const { name, image, description, tax_status, tax_slab, region } = req.body;

    const args = {
      name,
      image,
      description,
      tax_status,
      tax_slab,
      region,
    };
    validateAjv(CategorySchema.createCategoryschema, args);

    const { userId } = req.authPayload;
    const result = await CategoryController.createCategory(userId, args);
    log.info({ info: 'create category' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.put('/:category_id', async (req, res, next) => {
  log.info({ info: 'Inside update category by id' });
  try {
    const { category_id } = req.params;
    const { name, image, description, tax_status, tax_slab, region } = req.body;

    const args = {
      name,
      image,
      description,
      tax_status,
      tax_slab,
      region,
    };
    const { userId } = req.authPayload;
    const result = await CategoryController.updateCategoryById(userId, category_id, args);
    log.info({ info: 'update category by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.delete('/:category_id', async (req, res, next) => {
  log.info({ info: 'Inside delete category by id' });
  try {
    const { category_id } = req.params;
    const result = await CategoryController.deleteCategoryById(category_id);
    log.info({ info: 'delete category by id' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

router.put('/:category_id/mapping', async (req, res, next) => {
  log.info({ info: 'Inside create mapping' });
  try {
    const { category_id } = req.params;
    const categories = req.body;
    const result = await CategoryController.createMapping(category_id, categories);
    log.info({ info: 'create mapping' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
