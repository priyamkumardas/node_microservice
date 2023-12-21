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

router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside get data tree' });
  try {
    const result = await CategoryController.getDataTree();
    log.info({ info: 'get data tree' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
