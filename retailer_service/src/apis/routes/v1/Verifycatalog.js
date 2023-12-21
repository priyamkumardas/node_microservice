/* eslint-disable import/no-unresolved */
const express = require('express');

// Todo: User some module-alias
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const VerifyProductController = require('../../controllers/v1/VerifyProduct');

const router = express.Router();

router.get('/:shopid', async (req, res, next) => {
  log.info({info: 'Inside verify product'})
  try {
    const data = req.body;
    const { authPayload } = req;
    const { shopId } = authPayload;

    const result = await VerifyProductController.verifyProduct(data, authPayload.userId, shopId);
    log.info({info: 'Verified product'})
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

module.exports = router;
