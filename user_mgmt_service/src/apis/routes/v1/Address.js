const express = require('express');
const { HttpResponseHandler, Logger:log } = require('sarvm-utility');
const { getAllAddress, getAddress, addAddress, updateAddress, deleteAddress } = require('../../controllers/v1/Address');
const router = express.Router({ mergeParams: true });
const AddressService = require('../../services/v1/Address');
router.get('/', async (req, res, next) => {
  log.info({info: 'Inside get All Address'});
  try {
    const { userId } = req.params;
    const { valid, data, errors } = await getAllAddress(userId);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.get('/:id', async (req, res, next) => {
  log.info({info: 'Inside get  Address'});
  try {
    const { userId, id } = req.params;
    const { valid, data, errors } = await getAddress(userId, id);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.post('/', async (req, res, next) => {
  log.info({info: 'Inside add address'});
  try {
    const { userId } = req.params;
    const requestBody = req.body;
    const { valid, data, errors } = await addAddress(userId, requestBody);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.put('/:id', async (req, res, next) => {
  log.info({info: 'Inside update Address'});
  try {
    const { userId, id } = req.params;
    const requestBody = req.body;
    const { valid, data, errors } = await updateAddress(userId, id, requestBody);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.patch('/:id', async (req, res, next) => {
  log.info({info: 'Inside patch update Address'});
  try {
    const { userId, id } = req.params;
    const requestBody = req.body;
    const data = await updateAddress(userId, id, requestBody);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.delete('/:id', async (req, res, next) => {
  log.info({info: 'Inside Delete Address'});
  try {
    const { userId, id } = req.params;
    const { valid, data, errors } = await deleteAddress(userId, id);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
module.exports = router;
