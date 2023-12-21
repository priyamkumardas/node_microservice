/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
const productCategory = require('@models/productCategory');
const { INTERNAL_SERVER_ERROR } = require('../../errors/CommonError');
const { Logger: log } = require('sarvm-utility');

const getProductMapping = async (product_id) => {
  log.info({ info: 'Catalog Service :: Inside get product mapping' });
  try {
    const result = await productCategory.getProductMapping(product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const products = async (category_id) => {
  log.info({ info: 'Catalog Service :: Inside products' });
  try {
    const result = await productCategory.getProductList(category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addProductMapping = async (args, product_id) => {
  log.info({ info: 'Catalog Service :: Inside add product mapping' });
  try {
    const result = await productCategory.addProductMapping(args, product_id);
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
  log.info({ info: 'Catalog Service :: Inside insert product mapping' });
  try {
    const result = await productCategory.insertProductMapping(arrayOfCategoryProduct, product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addBulkProductMap = async (args) => {
  log.info({ info: 'Catalog Service: Inside add bulk product map' });
  try {
    const result = await productCategory.addProdctMappingWhileAddingProduct(args);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductCategoryMapping = async (product_id, category_id) => {
  try {
    const result = await productCategory.getProductCategoryMapping(product_id, category_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getAllProductMapping = async (productIds) => {
  log.info({ info: 'Catalog Service :: Inside get all product mapping' });
  try {
    const result = await productCategory.getAllProductMapping(productIds);
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
  products,
  getAllProductMapping,
  getProductCategoryMapping,
  addBulkProductMap,
  insertProductMapping,
};
