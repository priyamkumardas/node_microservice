const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require('sarvm-utility');
const { Address } = require('@root/src/apis/models');
const { DATA_BASE_ERROR } = require('../../../common/libs/ErrorHandler');
const getAllAddress = async (userId) => {
  log.info({info: 'Address Service :: inside get all Address' })
  try {
    const result = await Address.find({ userId });
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR("Error while getAllAddress by userId in DB");
  }
};

const getAddress = async (userId, id) => {
  log.info({info: 'Address Service :: inside get Address' })
  try {
    const result = await Address.findOne({
      userId: userId,
      _id: id,
    });
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR("Error while getting address in DB");
  }
};
const addAddress = async (userId, data) => {
  log.info({info: 'Address Service :: inside add Address' })
  try {
    const request = { userId, ...data };
    return await new Address(request).save({ isNew: true });
  } catch (err) {
    throw new DATA_BASE_ERROR("Error while adding address in DB");
  }
};
const updateAddress = async (userId, id, data) => {
  log.info({info: 'Address Service :: inside update Address' })
  try {
    const result = await Address.findOneAndUpdate(
      {
        userId: userId,
        _id: id,
      },
      {
        $set: {
          ...data,
        },
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      },
    );
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR("Error while updating address in DB");
  }
};
const deleteAddress = async (userId, id) => {
  log.info({info: 'Address Service :: inside delete Address' })
  try {
    const result = await Address.deleteOne({ userId: userId, _id: id }, { safe: true });
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR("Error while delete address in DB");
  }
};

module.exports = {
  getAllAddress,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
};
