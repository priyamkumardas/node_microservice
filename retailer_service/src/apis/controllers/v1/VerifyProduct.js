/* eslint-disable import/no-unresolved */
const CatalogService = require('@root/src/apis/services/v1/Catalog');
const { checkCatalogWithHoushold } = require('@root/src/common/VerifyProducts/verifyProduct');
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const getProduct = async (data, retailerId, shopId) => {
  log.info({info: 'Retailer Controller :: Inside get product'})
  try {
    const result = CatalogService.getProduct({ data, retailerId, shopId });
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const verifyProduct = async (data, retailerId, shopId) => {
  log.info({info: 'Retailer Controller :: Inside verify product'})
  try {
    const productDetailsFromDataBase = await getProduct({ data, retailerId, shopId });
    if (productDetailsFromDataBase !== null) {
      return checkCatalogWithHoushold(productDetailsFromDataBase, data);
    }
    return false;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  getProduct,
  verifyProduct,
};
