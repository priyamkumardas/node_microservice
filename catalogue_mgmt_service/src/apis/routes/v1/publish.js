/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const publishController = require('@controllers/v1/publish');

const router = express.Router();

router.get('/', async (req, res, next) => {
  log.info({ info: 'Inside publish catalog' });
  try {
    const { version } = req.query;
    const result = await publishController.publishCatalog(version);
    log.info({ info: 'published catalog' });
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({ error: error });
    next(error);
  }
});

module.exports = router;
