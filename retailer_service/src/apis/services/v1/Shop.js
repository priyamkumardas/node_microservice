/* eslint-disable import/no-unresolved */
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const Shop = require('@models/Shop');
const ShopLocation = require('../../models/ShopLocation');
const { createUUID } = require('@common/libs/uuid/uuid4');

const { uniqueS3Key } = require('@root/src/common/libs/JsonToS3/buildKey');
const {
  uploadProfileToS3,
  getProfileJSONS3,
} = require('@root/src/common/libs/JsonToS3/JsonToS3');
const { shopData } = require('./Catalog');


const axios = require('axios');
const { system_token, loadBalancer } = require('@config');
const { systemTokenForSubscription } = require('@constants');
const getShopDetailsByUserId = async ({ userId }) => {
  try {
    const result = await Shop.getShopDetailsByUserId({ userId });
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateShop = async (data, shopId) => {
  try {
    const result = await Shop.updateShopDetails(data, shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const addShop = async (shopData) => {
  try {
    const data = shopData;
    data.id = await Shop.getUniqueId();
    data.guid = createUUID();
    const result = await Shop.addShop(data);
    const { latitude, longitude } = data;
    const { shop_id } = result;
    await ShopLocation.insertItem(shop_id, longitude, latitude);

    let retailerDetails = { user_id: data.user_id, r_id: createUUID() };
    await Shop.createRetailer(retailerDetails);

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

// have this in transaction
const updateShopDetails = async (data, shopId) => {
  try {
    await Shop.findShop(shopId);
    const result = await Shop.updateShopDetails(data, shopId);
    log.info({ info: 'shop details updated' });
    const { latitude, longitude } = data;
    if (latitude && longitude) {
      await ShopLocation.updateShopLocation(shopId, longitude, latitude);
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

const shopLists = async (limit, offset, shop_id, pincode, city, shopName) => {
  try {
    const result = await Shop.shopLists(limit, offset, shop_id, pincode, city, shopName);
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

const shopCount = async() => {
  try {
    const totalCount = await Shop.shopCount();
    return totalCount;
  } catch (error) {
    Logger.error({ error: error });
    throw new DATA_BASE_ERROR(error);
  }
}

const deleteShop = async (shopId) => {
  try {
    await Shop.findShop(shopId);
    const result = await Shop.deleteShop(shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getShopSubscriptionData = async (shopId) => {
  try {
    log.info({ info: 'subsciption api call' });
    const config = {
      method: 'get',
      url: `${loadBalancer}/sub/apis/v1/subscription/${shopId}`,
      headers: {
        Authorization: `Bearer ${systemTokenForSubscription}`,
      },
    };

    const result = await axios(config);
    const { data } = result;
    const subscriptionDetails = data.data.subscriptionDetails;
    return subscriptionDetails;
  } catch (error) {
    console.log(error);
  }
};
const showShopDetailsByShopId = async (shopId) => {
  log.info({ info: 'Retailer Sevice :: Inside show shop details by shopId' });
  try {
    const result = await Shop.showShopDetailsByShopId(shopId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const shopListByRetailerId = async (userId) => {
  try {
    const result = await Shop.shopListByRetailerId(userId);
    log.info({ info: 'return result' });
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      log.error({ error: error });
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getAllShopListInArea = async (longitude, latitude, userId, hasDummySub) => {
  log.info({ info: 'Retailer Service :: Inside get all shop list in area' });
  try {
    const result = await ShopLocation.getShops(longitude, latitude, userId, hasDummySub);
    return result;
  } catch (error) {
    log.info(error);
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const subscriptionStatus = async (shop_id, isSubscribed) => {
  try {
    await Shop.findShop(shop_id);
    const result = await Shop.subscriptionStatus(shop_id, isSubscribed);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const kycStatus = async (shop_id, isKYCVerified) => {
  try {
    await Shop.findShop(shop_id);
    const result = await Shop.kycStatus(shop_id, isKYCVerified);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const updateGstNumber = async (shop_id, GST_no) => {
  try {
    await Shop.findShop(shop_id);
    const result = await Shop.updateGstNumber(shop_id, GST_no);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
const getGstNumber = async (shop_id) => {
  try {
    await Shop.findShop(shop_id);
    const result = await Shop.getGstNumber(shop_id);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const getShopIdByUserId = async (userId) => {
  try {
    const result = await Shop.shopListByRetailerId(userId);
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

const getAllShopDetails = async (userId) => {
  try {
    const result = await Shop.shopListByRetailerId(userId);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const showShopDetailsByUniqueId = async (id) => {
  try {
    const result = await Shop.showShopDetailsByUniqueId(id);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateShopProfile = async (shop, retailer, basicInformation) => {
  try {
    let guid = shop.guid;

    const uniqueKey = uniqueS3Key('shops', guid);

    let prevProfile = await getProfileJSONS3(uniqueKey);
    let catalog = prevProfile === undefined ? {} : prevProfile.catalog;
    let data = shopData(catalog, shop, retailer, basicInformation);

    await uploadProfileToS3(uniqueKey, data);

    return true;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

const updateShopStatus = async (shop_id, shop_status) => {
  try {
    const result = await Shop.updateShopStatus(shop_id, shop_status);
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
  getShopDetailsByUserId,
  updateShop,
  addShop,
  updateShopDetails,
  shopLists,
  deleteShop,
  showShopDetailsByShopId,
  shopListByRetailerId,
  getAllShopListInArea,
  shopCount,
  subscriptionStatus,
  kycStatus,
  updateGstNumber,
  getShopIdByUserId,
  getGstNumber,
  getAllShopDetails,
  getShopSubscriptionData,
  showShopDetailsByUniqueId,
  updateShopProfile,
  updateShopStatus,
};

// getShopListing

// getShopDetails

// shopLists
// showShopDetailsByShopId
// shopListByRetailerId
// getAllShopListInArea
// getShopIdByUserId
// getGstNumber

// createShop,
// addShop,

// updateShop
// updateShopDetails,
// updateGstNumber
// subscriptionStatus,
// kycStatus,

// deleteShop
// deleteShop
