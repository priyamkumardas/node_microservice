const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  HttpResponseHandler, Logger:log
} = require('sarvm-utility');
const { FavouriteService } = require('@services/v1');
const validateRequest = require('@root/src/common/libs/Validator');
const {
  GetAllValidateSchema,
  GetValidateSchema,
  addFavouriteValidationSchema,
  updateFavouriteSchema,
} = require('@root/src/common/libs/Validation');
const getAllFavourite = async (userId) => {
  log.info({info: 'Favourite Controller :: inside get all favourite' })
  const { valid, errors } = await validateRequest(GetAllValidateSchema, { userId });
  if (!valid) return { valid, data: [], errors };
  const data = await FavouriteService.getAllFavourites(userId);
  return { valid, data, errors };
};
const getFavourite = async (userId, id) => {
  log.info({info: 'Favourite Controller :: inside get favourite '})
  const { valid, errors } = await validateRequest(GetValidateSchema, { userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await FavouriteService.getFavourite(userId, id);
  return { valid, data, errors };
};
const addFavourite = async (userId, request) => {
  log.info({info: 'Adding favourite Controller :: inside add favourite'})
  const { valid, errors } = await validateRequest(addFavouriteValidationSchema, { ...request, userId });
  if (!valid) return { valid, data: {}, errors };
  const data = await FavouriteService.addFavourite(userId, request);
  return { valid, data, errors };
};
const updateFavourite = async (userId, id, request) => {
  log.info({info: 'update favourite Controller :: inside update favourite'})
  const { valid, errors } = await validateRequest(updateFavouriteSchema, { ...request, userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await FavouriteService.updateFavourite(userId, id, request);
  return { valid, data, errors };
};
const deleteFavourite = async (userId, id) => {
  log.info({info: 'Delete Favourite Controller :: inside delete favourite'})
  const { valid, errors } = await validateRequest(GetValidateSchema, { userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await FavouriteService.deleteFavourite(userId, id);
  return { valid, data, errors };
};
module.exports = {
  getAllFavourite,
  getFavourite,
  addFavourite,
  updateFavourite,
  deleteFavourite,
};
