const express = require('express');

const { HttpResponseHandler, Logger: log  } = require('sarvm-utility');
const { DataController } = require('@controllers/v1');
const router = express.Router();

router.get('/emp', async (req, res, next) => {
  log.info({info: 'Inside get Employee'})

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getEmployees({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/sub', async (req, res, next) => {
  log.info({info: 'Inside get subscription'})

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getSubscriptions({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/ref', async (req, res, next) => {
  log.info({info: 'Inside get Referral'})

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getReferral({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/rew', async (req, res, next) => {
  log.info({info: 'Inside get Reward'})
  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getReward({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/userData', async (req, res, next) => {
  log.info({info: 'Inside get userData'})

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getUserData({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/shopData', async (req, res, next) => {
  log.info({info: 'Inside get shopData'})

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await DataController.getShop({ startDate, endDate });
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});


router.get('/getstoremetadata/:shopId', async (req, res, next) => {
  //Done
  try {
    const { shopId } = req.params;
    
    const result = await DataController.getstoremetadata(shopId);
    
  
    HttpResponseHandler.success(req, res, result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
