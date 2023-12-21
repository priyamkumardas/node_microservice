/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const express = require('express');
const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const WorkingHoursController = require('@controllers/v1/WorkingHours');
const validateDto = require('@root/src/common/libs/middleware/validate-dto');
const { WorkingHours } = require('@root/src/common/libs/Validation/ShopWorkingHours');

const router = express.Router();

router.post('/:shopid', validateDto(WorkingHours, 'body'), async (req, res, next) => {
  log.info({info: 'Inside create records'})
  try {
    const args = req.body;
    // const { authPayload } = req;
    // const { shopId } = authPayload;
    const { shopid } = req.params;
    const data = await WorkingHoursController.createRecords(args, shopid);
    log.info({info: 'created records'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  log.info({info: 'Inside find all open shop'})
  try {
    const { start_time, end_time, day } = req.body;
    const data = await WorkingHoursController.findAllOpenShop(start_time, end_time, day);
    log.info({info: 'found all open shop'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.get('/:shopid', async (req, res, next) => {
  log.info({info: 'Inside get records'})
  try {
    // const { authPayload } = req;
    // const { shopId } = authPayload;
    const { shopid } = req.params;
    const data = await WorkingHoursController.getRecords(shopid);
    log.info({info: 'got records'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  log.info({info: 'Retailer Controller :: Inside toggle status'})
  try {
    const { authPayload } = req;
    const { shopId } = authPayload;

    const { shiftId, isActive } = req.body;
    const data = await WorkingHoursController.toggleStatus({ shiftId, shopId, isActive });
    log.info({info: 'toggle status'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  log.info({info: 'Inside delete records'})
  try {
    const { authPayload } = req;
    const { shopId } = authPayload;

    const { shiftId } = req.body;
    const data = await WorkingHoursController.deleteRecords({ shopId, shiftId });
    log.info({info: 'Deleted records'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});

module.exports = router;
