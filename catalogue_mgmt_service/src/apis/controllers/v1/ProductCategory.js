/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const productCategoryService = require('@services/v1/ProductCategoryMapping');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { uniqeNumber } = require('@root/src/common/libs/ShortUniqueID/shortUniqueId');
const { productById } = require('./product');
const { Logger: log } = require('sarvm-utility');

const getProductMapping = async (product_id) => {
  log.info({ info: 'Catalog Controller :: Inside get product mapping' });
  try {
    await productById(product_id);
    const result = await productCategoryService.getProductMapping(product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addProductMapping = async (product_id, userId, args) => {
  log.info({ info: 'Catalog Controller :: Inside add product mapping' });
  try {
    for (const i in args) {
      args[i].id = uniqeNumber();
      args[i].product_id = product_id;
      args[i].created_by = userId;
      args[i].updated_by = userId;
    }
    const result = await productCategoryService.addProductMapping(args, product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const insertProductMapping = async (arrayOfCategoryProduct, product_id) => {
  log.info({ info: 'Catalog Controller :: Inside insert product mapping' });
  try {
    const result = await productCategoryService.insertProductMapping(arrayOfCategoryProduct, product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  getProductMapping,
  addProductMapping,
  insertProductMapping,
};
