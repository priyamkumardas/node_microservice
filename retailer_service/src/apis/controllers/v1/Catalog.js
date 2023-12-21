/* eslint-disable import/no-unresolved */
const CatalogService = require('@root/src/apis/services/v1/Catalog');
const ShopMetaService = require('@root/src/apis/services/v1/ShopMetaData');
const ShopService = require('@root/src/apis/services/v1/Shop');
const { getUserDetails } = require('../../services/v1/UserManagement');
const { OPENING_HOURS } = require('@root/src/constants/catalogProduct.js');

const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const getProduct = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside get product' });
  try {
    const { shopid } = args;
    let shop = await ShopService.showShopDetailsByShopId(shopid);
    let guid = shop[0].guid;
    const result = CatalogService.getProduct(guid);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getCatalog = async () => {
  log.info({ info: 'Retailer Controller :: Inside get catalog' });
  try {
    const result = await ShopMetaService.getMetaData();
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

// const createProduct = async (data, retailerId, shopId) => {
//   try {
//     const result = await CatalogService.createProduct(data, retailerId, shopId);
//     return result;
//   } catch (error) {
//     if (error.key === 'rms') {
//       throw error;
//     } else {
//       throw new INTERNAL_SERVER_ERROR(error);
//     }
//   }
// };

const updateProduct = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside update product' });
  try {
    const { categories, products, user } = args;
    const { userId, shopId } = user;
    const data = { categories, products };
    const result = await CatalogService.updateProduct(data, userId, shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateBulkProduct = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside update bulk product' });
  try {
    const { categories, products, shopId } = args;
    const data = { categories, products };
    const result = await CatalogService.updateBulkProduct(data, shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const uploadCatalogProducts = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside upload catalog products' });
  try {
    const { catalog, shopId, user } = args;
    const { userId } = user;
    //as shop is in array form we need to get the first value
    let shop = await ShopService.showShopDetailsByShopId(shopId);
    shop = shop[0];
    // if(shop.length === 0) {
    //throw shop not found error
    // }
    let retailer = await getUserDetails(shop.user_id);
    // if(retailer === null) {
    //throw retailer not found error
    // }
    //const result = await CatalogService.uploadCatalogProducts(catalog, userId, shopId);

    const result = await CatalogService.uploadCatalogProducts(catalog, shop, retailer);
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
  getProduct,
  getCatalog,
  updateBulkProduct,
  uploadCatalogProducts,
  updateProduct,
};
