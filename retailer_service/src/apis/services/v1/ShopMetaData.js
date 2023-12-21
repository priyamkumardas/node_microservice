/* eslint-disable import/no-unresolved */
/* eslint-disable no-param-reassign */
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const ShopMetaData = require('@models/ShopMetaData');
const Shop = require('../../models/Shop');

const addMetaData = async (shopId, categories, uniqueKey) => {
  try {
    await Shop.findShop(shopId);
    const result = await ShopMetaData.addMetaData(shopId, categories, uniqueKey);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getMetaData = async () => {
  log.info({info: 'Retailer Service :: Inside get meta data'})
  try {
    const result = await ShopMetaData.getAllCatalogMetaData();
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getAllMetaData = async (shopIds) => {
  log.info({info: 'Retailer Service :: Inside get all meta data'})
  try {
    const result = await ShopMetaData.getAllMetaData(shopIds);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  addMetaData,
  getMetaData,
  getAllMetaData,
};
