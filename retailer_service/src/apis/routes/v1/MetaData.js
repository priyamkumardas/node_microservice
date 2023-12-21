/* eslint-disable import/no-unresolved */
const express = require('express');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const RetailerMetaData = require('@controllers/v1/MetaData');

const router = express.Router();

router.get('/', async (req, res, next) => {
  log.info({info: 'Inside meta data'})
  try {
    const { authPayload } = req;
    const { shopId } = authPayload;
    const result = await RetailerMetaData.metaData(shopId);
    log.info({info: 'Meta data'})
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

module.exports = router;
