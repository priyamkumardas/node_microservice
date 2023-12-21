const RetailerService = require('@services/v1/Retailer');
const UserManagement = require('@services/v1/UserManagement');
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger,
} = require('sarvm-utility');
const { SHOP_NOT_FOUND_ERROR } = require('@errors');
const { SHOP_ALREADY_EXIST } = require('../../../common/libs/ErrorHandler');
const { request } = require('http');
const { payment } = require('../../services/v1/orderMock');

const addRetailer = async (args) => {
  try {
    Logger.info({ info: 'inside add retailer' });
    let { name, mobile, app, upi, qr_image, active } = args;
    let retailerData = { name, mobile, app, upi, qr_image, active };
    let user_id = args.userId;
    const result = await RetailerService.addRetailer(user_id, retailerData);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getAllRetailer = async (args) => {
  try {
    const result = await RetailerService.getAllRetailer();
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getRetailer = async (args) => {
  try {
    Logger.info({ info: 'inside get retailer' });
    const result = await RetailerService.getRetailer(args.userId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateRetailer = async (args) => {
  try {
    Logger.info({ info: 'inside update retailer' });

    let { r_id, payment_info_id } = args;
    let { name, mobile, app, upi, qr_image, active } = args;
    let retailerData = { name, mobile, app, upi, qr_image, active };

    const result = await RetailerService.updateRetailer(r_id, payment_info_id, retailerData);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const deletePaymentApp = async (args) => {
  try {
    const result = await RetailerService.deletePaymentApp(args.r_id, args.payment_info_id);
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
  updateRetailer,
  getRetailer,
  deletePaymentApp,
  getAllRetailer,
};
