const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  HttpResponseHandler, Logger:log
} = require('sarvm-utility');
const { AddressService } = require('@services/v1');
const validateRequest = require('@root/src/common/libs/Validator');
const { AddressValidateSchema, GetAllValidateSchema, GetValidateSchema, addAddressValidationSchema, updateAddressSchema } = require('@root/src/common/libs/Validation');
const getAllAddress = async (userId) => {
  log.info({info: 'Address Controller :: inside get all address' })
  const { valid, errors } = await validateRequest(GetAllValidateSchema, { userId });
  if (!valid) return { valid, data: [], errors };
  const data = await AddressService.getAllAddress(userId);
  return { valid, data, errors };
};
const getAddress = async (userId, id) => {
  log.info({info: 'Address Controller :: inside get address' });
  const { valid, errors } = await validateRequest(GetValidateSchema, { userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await AddressService.getAddress(userId, id);
  return { valid, data, errors };
};
const addAddress = async (userId, request) => {
  // const schema = {
  //   ...AddressValidateSchema,
  //   properties: { ...AddressValidateSchema.properties, ...GetAllValidateSchema.properties },
  //   required: [...AddressValidateSchema.required, ...GetAllValidateSchema.required],
  // };

  log.info({info: 'Address Controller :: inside add address' })
  const { valid, errors } = await validateRequest(addAddressValidationSchema, { ...request, userId });
  if (!valid) return { valid, data: {}, errors };
  const data = await AddressService.addAddress(userId, request);
  return { valid, data, errors };
};
const updateAddress = async (userId, id, request) => {
  // const schema = {
  //   ...AddressValidateSchema,
  //   properties: { ...AddressValidateSchema.properties, ...GetValidateSchema.properties },
  //   required: [],
  // };
  log.info({info: 'Address Controller :: inside update address' })
  const { valid, errors } = await validateRequest(updateAddressSchema, { ...request, userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await AddressService.updateAddress(userId, id, request);
  return { valid, data, errors };
};
const deleteAddress = async (userId, id) => {
  log.info({info: 'Address Controller :: inside delete address' })
  const { valid, errors } = await validateRequest(GetValidateSchema, { userId, id });
  if (!valid) return { valid, data: {}, errors };
  const data = await AddressService.deleteAddress(userId, id);
  return { valid, data, errors };
};
module.exports = {
  getAllAddress,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
};
