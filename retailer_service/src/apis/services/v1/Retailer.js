/* eslint-disable import/no-unresolved */
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const Retailer = require('@models/Retailer');
const { createUUID } = require('@common/libs/uuid/uuid4');

const addRetailer = async (user_id, retailerData) => {
  try {
    retailerData.payment_info_id = createUUID();
    const result = await Retailer.addRetailer(user_id, retailerData);
    return result;
  } catch (error) {
    log.error({ error: error });
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getAllRetailer = async () => {
  try {
    const result = await Retailer.getAllRetailer();
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getRetailer = async (user_id) => {
  try {
    const result = await Retailer.getRetailer(user_id);
    log.info({ info: 'return result' });
    return result;
  } catch (error) {
    log.error({ error: error });
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateRetailer = async (r_id, payment_info_id, retailerData) => {
  try {
    const result = await Retailer.updateRetailer({ r_id, payment_info_id }, retailerData);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deletePaymentApp = async (r_id, payment_info_id) => {
  try {
    const result = await Retailer.deletePaymentApp({ r_id, payment_info_id });
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
  addRetailer,
  getRetailer,
  updateRetailer,
  deletePaymentApp,
  getAllRetailer,
};
