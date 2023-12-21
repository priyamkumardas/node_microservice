/* eslint-disable import/no-unresolved */
const RetailerService = require('@root/src/apis/services/v1/Catalog');
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require('sarvm-utility');

const getProduct = async (data, retailerId, shopId) => {
  try {
    const result = RetailerService.getProduct({ data, retailerId, shopId });
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
//     const result = RetailerService.createProduct(data, retailerId, shopId);
//     return result;
//   } catch (error) {
//     if (error.key === 'rms') {
//       throw error;
//     } else {
//       throw new INTERNAL_SERVER_ERROR(error);
//     }
//   }
// };

const updateProduct = async (data, retailerId, shopId) => {
  try {
    const result = RetailerService.updateProduct(data, retailerId, shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deleteProduct = async (data, retailerId, shopId) => {
  try {
    const result = RetailerService.deleteProduct(data, retailerId, shopId);
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
  createProduct,
  updateProduct,
  deleteProduct,
};
