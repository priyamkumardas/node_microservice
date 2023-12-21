/* eslint-disable import/no-unresolved */
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const WorkingHours = require('@models/WorkingHours');
const Shop = require('../../models/Shop');

const createRecords = async (records, shopid) => {
  log.info({info: 'Retailer Service :: Inside create records'})
  try {
    await Shop.findShop(shopid);
    const data = await WorkingHours.create(records, shopid);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getShopTiming = async (shopId) => {
  log.info({info: 'Retailer Service :: Inside get records'})
  try {
    await Shop.findShop(shopId);
    const data = await WorkingHours.getShopTiming(shopId);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteRecords = async (args) => {
  log.info({info: 'Retailer Service :: Inside delete records'})
  try {
    const { shopId, shiftId } = args;
    await Shop.findShop(shopId);
    const data = await WorkingHours.delete(shopId, shiftId);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const toggleStatus = async (args) => {
  log.info({info: 'Retailer Service :: Inside toggle status'})
  try {
    const { shopId, shiftId, isActive } = args;
    await Shop.findShop(shopId);
    const data = await WorkingHours.toggleStatus(shopId, shiftId, isActive);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const findAvailableUsers = async (currentTime) => {
  try {
    const data = WorkingHours.findAvailableUsers(currentTime);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const findAllShopOpenInTime = async (startTime, endTime) => {
  log.info({info: 'Retailer Service :: Inside find all open shop'})
  try {
    const data = WorkingHours.findAllShopOpenInTime(startTime, endTime);
    return data;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  createRecords,
  getShopTiming,
  findAvailableUsers,
  deleteRecords,
  toggleStatus,
  findAllShopOpenInTime,
};
