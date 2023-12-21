const express = require('express');
const { HttpResponseHandler, Logger:log } = require('sarvm-utility');
const {
  getAllFavourite,
  getFavourite,
  addFavourite,
  updateFavourite,
  deleteFavourite,
} = require('../../controllers/v1/Favourite');
const router = express.Router();
router.get('/:userId', async (req, res, next) => {
  log.info({info: 'inside get all favorites'})
  try {
    const { userId } = req.params;
    const { valid, data, errors } = await getAllFavourite(userId);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    log.info({info: 'got all favorite'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.get('/:userId/:id', async (req, res, next) => {
  log.info({info: 'inside get favorite'})
  try {
    const { userId, id } = req.params;
    const { valid, data, errors } = await getFavourite(userId, id);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    log.info({info: 'got favourite'})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error: error})
    next(error);
  }
});
router.post('/:userId', async (req, res, next) => {
  log.info({info: 'inside add favourite'})
  try {
    const { userId } = req.params;
    const requestBody = req.body;
    const { valid, data, errors } = await addFavourite(userId, requestBody);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    log.info({info: 'adding favourite'});
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error })
    next(error);
  }
});
router.put('/:userId/:id', async (req, res, next) => {
  log.info({info: 'update favourite'});
  try {
    const { userId, id } = req.params;
    const requestBody = req.body;
    const { valid, data, errors } = await updateFavourite(userId, id, requestBody);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    log.info({info: 'updated favourite'});
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error})
    next(error);
  }
});
router.patch('/:userId/:id', async (req, res, next) => {
  log.info({info:'patch update favorite'});
  try {
    const { userId, id } = req.params;
    const requestBody = req.body;
    const data = await updateFavourite(userId, id, requestBody);
    log.info({info: 'patching update favorite'});
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error})
    next(error);
  }
});
router.delete('/:userId/:id', async (req, res, next) => {
  log.info({info: 'delte favourite'});
  try {
    const { userId, id } = req.params;
    const { valid, data, errors } = await deleteFavourite(userId, id);
    if (!valid) HttpResponseHandler.error(req, res, errors, 400);
    log.info({info: 'favourite deleted '})
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error})
    next(error);
  }
});
module.exports = router;
