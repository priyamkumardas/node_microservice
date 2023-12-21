/* eslint-disable import/no-unresolved */
/* eslint-disable camelcase */
const Product = require('@models/product');
const {
  ERROR_CODES: { INTERNAL_SERVER_ERROR },
} = require('@constants');
const { Logger: log } = require('sarvm-utility');

const productById = async (product_id) => {
  log.info({ info: 'Catalog Service :: Inside  product by id' });
  try {
    const result = await Product.getProductById(product_id);
    return result;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};

const productLists = async (filterSearch) => {
  log.info({ info: 'Catalog Service :: Inside product lists' });
  try {
    const result = await Product.getProducts(filterSearch);
    return result;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};

const createProduct = async (product) => {
  log.info({ info: 'Catalog Service :: Inside create product' });
  try {
    const result = await Product.createProduct(product);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const productBulkUpload = async (product) => {
  log.info({ info: 'Catalog Service: Inside product bulk upload' });
  try {
    const result = await Product.productBulkUpload(product);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductByName = async (name) => {
  log.info({ info: 'Catalog Service :: Inside get product by name' });
  try {
    const result = await Product.productByName(name);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateProductById = async (product_id, product) => {
  log.info({ info: 'Catalog Service :: Inside update product by id' });
  try {
    const result = await Product.updateProduct(product_id, product);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const deleteProductById = async (product_id) => {
  log.info({ info: 'Catalog Service :: Inside delete product by id' });
  try {
    const result = await Product.deleteProductId(product_id);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductListsByIds = async (productIds) => {
  log.info({ info: 'Catalog Service :: Inside get product lists by ids' });
  try {
    const result = await Product.getProductListsByIds(productIds);
    return result;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductByDummyKey = async (dummyKey) => {
  try {
    if (dummyKey) {
      const result = await Product.getProductByDummyKey(dummyKey);
      if (result) {
        if (result.length >= 1) {
          const { product_id } = result[0];
          return product_id;
        }
        return null;
      }
      return null;
    }
    return null;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getProductByDummyKeys = async (dummyKeys) => {
  try {
    if (dummyKeys) {
      const result = await Product.getProductByDummyKeys(dummyKeys);
      return result;
    }
    return null;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  productById,
  productLists,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductListsByIds,
  getProductByName,
  getProductByDummyKey,
  getProductByDummyKeys,
  productBulkUpload,
};
