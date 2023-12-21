/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const ShopService = require('@services/v1/Shop');
const UserManagement = require('@services/v1/UserManagement');
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  apiServices,
  Logger,
} = require('sarvm-utility');
const { SHOP_NOT_FOUND_ERROR } = require('@errors');
const { SHOP_ALREADY_EXIST } = require('../../../common/libs/ErrorHandler');

const { bizBaseUrl } = require('@config');

const { createKey } = require('./createUniqueKey');
const { amazonPresignedUrl, imageUrl } = require('@services/v1/UploadDocuments');

const { getUserDetails } = require('../../services/v1/UserManagement');
const { shopCount } = require('../../models/Shop');

const {
  auth: { Token },
} = apiServices;

const presignedUrl = async () => {
  try {
    const key = createKey('retailerQRCode');
    const preSignedUrl = await amazonPresignedUrl(key);
    const url = imageUrl(key);

    const data = { preSignedUrl, url };
    return data;
  } catch (error) {
    if (error.key === 'cms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addShop = async (args) => {
  try {
    const {
      longitude,
      latitude,
      shop_number,
      locality,
      landmark,
      street,
      shop_name,
      selling_type,
      city,
      pincode,
      user_id,
      type_of_retailer,
    } = args;
    const { userId, isEmployee } = args.user;
    const data = {
      longitude,
      latitude,
      shop_number,
      locality,
      landmark,
      street,
      shop_name,
      selling_type,
      city,
      pincode,
      user_id,
      type_of_retailer,
    };
    const params = data;
    params.user_id = userId;
    params.hasDummySub = isEmployee;
    const shopExist = await ShopService.getShopIdByUserId(userId);
    if (shopExist.length > 0) {
      Logger.warn({ warn: 'Shop Already Exist' });
      throw new SHOP_ALREADY_EXIST();
    }
    const result = await ShopService.addShop(params);
    updateProfileJSON({ shopId: result.shop_id });
    //now generate Token
    const { app_name, app_version_code, authorization } = args;
    const headers = { app_version_code, app_name, authorization };
    // const { userId } = authPayload;
    const authServiceResponse = await Token({
      headers,
      params: {
        userId,
      },
    });
    const credentials = authServiceResponse.data;
    const obj = {
      shop_id: result.shop_id,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      profileUrl: `${bizBaseUrl}/shops/${result.guid}`,
    };
    return obj;
  } catch (error) {
    Logger.error({ error: error });
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateShopDetails = async (args) => {
  const {
    longitude,
    latitude,
    shop_number,
    locality,
    landmark,
    city,
    pincode,
    user_id,
    type_of_retailer,
    shopId,
    manager_id,
    min_order_value,
    shop_name,
  } = args;
  const data = {
    longitude,
    latitude,
    shop_number,
    locality,
    landmark,
    city,
    pincode,
    user_id,
    type_of_retailer,
    manager_id,
    min_order_value,
    shop_name,
  };
  try {
    const result = await ShopService.updateShopDetails(data, shopId);

    updateProfileJSON({ shopId: shopId });

    return result;
  } catch (error) {
    console.log(error);
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getShopCount = async() => {
  try {
    const totalCount = await shopCount();
    return totalCount
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
}

const addManager = async (args) => {
  try {
    const { managerId, retailerId } = args;
    const shopData = await shopListByRetailerId(retailerId);
    if (shopData == null) {
      Logger.warn({ warn: 'shop soes not exit' });
      throw SHOP_NOT_FOUND_ERROR();
    }
    const { shop_id } = shopData[0];
    const shopId = shop_id;
    const user_id = retailerId;
    const manager_id = managerId;
    // const data = { user_id: retailerId, manager_id: managerId };
    const temp = { user_id, manager_id };
    // const result = await updateShopDetails(temp);
    const result = await ShopService.updateShopDetails(temp, shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateShopManager = async (args) => {
  try {
    const { manager_id, shopId } = args;
    const temp = { manager_id };
    const result = await ShopService.updateShopDetails(temp, shopId);
    Logger.info({ info: 'shop manager updated' });
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getShopAndRetailerDetails = async (args) => {
  try {
    const { retailerId } = args;
    const retailerInfo = await UserManagement.getUserDetails(retailerId);
    let retailerData = [retailerInfo];
    const shopData = await shopListByRetailerId(retailerId);
    let result = { retailerData, shopData };
    Logger.info({ info: 'data fetched successfully' });
    return result;
  } catch (error) {
    Logger.error({ error: error });
    throw new INTERNAL_SERVER_ERROR(error);
  }
};
const deleteManager = async (args) => {
  try {
    const { shopId } = args;
    const data = { manager_id: null };

    const result = await ShopService.updateShopDetails(data, shopId);
    Logger.info({ info: 'Manager deleted' });
    return result;
    // return await updateShopDetails(data);
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};
const updateManager = async (args) => {
  const { retailerUserId, managerUserId } = args;
  try {
    //find shop id by retailerUserId
    const shopDetails = await ShopService.getShopIdByUserId(retailerUserId);
    const shop_id = shopDetails[0].shop_id;
    const inputData = { user_id: retailerUserId, manager_id: managerUserId };
    const result = await ShopService.updateShopDetails(inputData, shop_id);
    return result;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};
const shopLists = async (limit, offset, shop_id, pincode, city, shopName) => {
  try {
    const result = ShopService.shopLists(limit, offset, shop_id, pincode, city, shopName);
    Logger.info({ info: 'data fetched successfully' });
    return result;
  } catch (error) {
    Logger.error;
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const deleteShop = async (args) => {
  try {
    const { shopId } = args;
    const result = ShopService.deleteShop(shopId.valueOf());
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const showShopDetailsByShopId = async (args) => {
  try {
    const { shopId } = args;
    const result = await ShopService.showShopDetailsByShopId(shopId);
    if (result.length === 0) {
      Logger.warn({ warn: 'Shop Not Found' });
      throw new SHOP_NOT_FOUND_ERROR();
    }
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getAccountManagerByShopId = async (args) => {
  try {
    const result = await showShopDetailsByShopId(args);
    Logger.info({ info: 'data fetched successfully' });
    const manager_id = result[0].manager_id;
    console.log(result);
    if (manager_id) {
      return await UserManagement.getUserDetails(manager_id);
    }
    return manager_id;
  } catch (error) {
    //this has to be better
    throw new INTERNAL_SERVER_ERROR(error);
  }
};
const shopListByRetailerId = async (user_id) => {
  try {
    const result = await ShopService.shopListByRetailerId(user_id);
    Logger.info({ info: 'data fetched successfully' });
    return result;
  } catch (error) {
    Logger.error({ error: error });
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const subscriptionStatus = async (args) => {
  const { shopId, isSubscribed } = args;
  try {
    const result = await ShopService.subscriptionStatus(shopId, isSubscribed);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const kycStatus = async (args) => {
  const { shopId, isKYCVerified } = args;
  // const { shopId } = req.params;
  try {
    const result = await ShopService.kycStatus(shopId, isKYCVerified);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateGstNumber = async (args) => {
  const { shopId, GST_no } = args;
  // const { GST_no } = req.body;
  try {
    const result = await ShopService.updateGstNumber(shopId, GST_no);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const gstNumber = async (args) => {
  const { shopId } = args;
  try {
    const result = await ShopService.getGstNumber(shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateDummySub = async (args) => {
  const { userId, hasDummySub } = args;
  const shop = await ShopService.getShopDetailsByUserId({ userId });
  if (!shop) {
    Logger.warn({ warn: 'Shop Not Found' });
    throw new SHOP_NOT_FOUND_ERROR();
  }
  const { shop_id: shopId } = shop;
  const result = await ShopService.updateShop({ hasDummySub }, shopId);
  return result;
};
const getAllShop = async (args) => {
  const { userId, limit, offset, shop_id, pincode, city, shopName } = args;
  if (userId) {
    Logger.info({ info: 'user id not null' });
    result = await shopListByRetailerId(userId);
  } else {
    Logger.warn({ warn: 'user id is  null' });
    result = await shopLists(limit, offset, shop_id, pincode, city, shopName);
  }
  Logger.info({ info: 'get result successfully' });
  return result;
};
const getAllShopDetails = async (args) => {
  const { userId } = args;
  const shopDetails = await shopListByRetailerId(userId);
  // const { shop_Id } = shopDetails;
  // const subscriptionDetails = await subscriptionStatus(shop_Id);
  // const kysDetails = await kycStatus(userId);
  // const gstDetails = await gstNumber(userId);
  // return { shopDetails, subscriptionDetails, kysDetails, gstDetails };
  return shopDetails;
};

const getShopDetailsByUniqueId = async (args) => {
  return ShopService.showShopDetailsByUniqueId(args.id);
};

const updateProfileJSON = async (args) => {
  const { shopId } = args;
  let shop = await ShopService.showShopDetailsByShopId(shopId);
  shop = shop[0];
  let retailer = await getUserDetails(shop.user_id);
  let basicInformation = retailer.basicInformation;

  return ShopService.updateShopProfile(shop, retailer, basicInformation);
};

const updateShopStatus = async (args) => {
  const { userId, shop_status } = args;
  try {
    const shopData = await ShopService.getShopIdByUserId(userId);
    let shop_id = shopData[0].shop_id;
    const result = await ShopService.updateShopStatus(shop_id, shop_status);
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
  addShop,
  getShopCount,
  updateShopDetails,
  shopLists,
  getAllShopDetails,
  deleteShop,
  showShopDetailsByShopId,
  shopListByRetailerId,
  subscriptionStatus,
  kycStatus,
  updateGstNumber,
  gstNumber,
  updateManager,
  getAccountManagerByShopId,
  deleteManager,
  updateDummySub,
  addManager,
  getShopAndRetailerDetails,
  getAllShop,
  updateShopManager,
  presignedUrl,
  getShopDetailsByUniqueId,
  updateProfileJSON,
  updateShopStatus,
};
