/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const { isSubscribeRequired } = require('@config');
const ShopService = require('@services/v1/Shop');
const ShopMetaDataService = require('@services/v1/ShopMetaData');
const { getJsonUrl, uploadJSONtoS3 } = require('@root/src/common/libs/JsonToS3/JsonToS3');
const { uniqueId } = require('@root/src/common/libs/GenerateUniqueId');
const { uniqueS3Key } = require('@root/src/common/libs/JsonToS3/buildKey');


// Todo: FIXME in getCategories - Make it better
function getRandomSubarray(arr, size) {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}
const getCategories = () => {
  const arr = ['Vegetables', 'Bakery', 'Restaraunt', 'Fruits', 'Dairy', 'Flower'];
  return getRandomSubarray(arr, 2);
};
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR }, Logger: log,
} = require('sarvm-utility');
const { getShopOwnerDetails } = require('../../services/v1/UserManagement');
const deliveryChargesConstant = require('@root/src/constants/deliveryChargesConstant');
const getShopMetaData = async (args) => {
  try {
    const { shopId } = args;

    const result = await ShopService.showShopDetailsByShopId(shopId);
    if (isSubscribeRequired === 'true') {
      
      if (result.length > 0 && result[0].isSubscribed != null && result[0].isSubscribed === true) {
        const resultFromMetaData = await ShopMetaDataService.getMetaData(shopId);
        result[0].store_meta = resultFromMetaData;
        result[0].seller = {
          phone: await getShopOwnerDetails(result[0].user_id),
        };
        return result;
      }
      log.warn({warn:'null '})
      return null;
    }
    if (result.length > 0) {
      const resultFromMetaData = await ShopMetaDataService.getMetaData(shopId);
      result[0].store_meta = resultFromMetaData;
      // result[0].categories = getCategories(shop_id);
      result[0].categories = resultFromMetaData[0] ? resultFromMetaData[0].categories : [];
      result[0].seller = {
        phone: await getShopOwnerDetails(result[0].user_id),
      };
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
const getShopMetaData2 = async (result) => {
  try {
    //  const result = await ShopService.showShopDetailsByShopId(shop_id);
    if (isSubscribeRequired === 'true') {
      if (result && result.isSubscribed != null && result.isSubscribed === true) {
        const resultFromMetaData = await ShopMetaDataService.getMetaData(shop_id);
        result[0].store_meta = resultFromMetaData;
        result[0].seller = {
          phone: await getShopOwnerDetails(result.user_id),
        };
        return result;
      }
      return null;
    }
    if (result) {
      const resultFromMetaData = await ShopMetaDataService.getMetaData(result.shop_id);
      result.store_meta = resultFromMetaData;
      // result[0].categories = getCategories(shop_id);
      result.categories = resultFromMetaData[0] ? resultFromMetaData[0].categories : [];
      result.seller = {
        phone: await getShopOwnerDetails(result.user_id),
      };
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
const getAllShopMetaData = async (args) => {
  log.info({info: 'Retailer Controller :: Inside get all shop meta data'});
  const { longitude, latitude, distance, hasDummyStr, userId } = args;
  const hasDummySub = hasDummyStr === 'true' ? true : false;
  try {
    const lat = parseFloat(latitude).toFixed(2);
    const lon = parseFloat(longitude).toFixed(2);
    const result = await ShopService.getAllShopListInArea(lon, lat, userId, hasDummySub);
    const data = [];
    const usersIds = result.map((item) => item.user_id).join(';');
    const users = await getShopOwnerDetails(usersIds);
    const usersObject = users.reduce((a, v) => ({ ...a, [v._id]: v }), {});
    const shopIds = result.map((item) => item.shop_id);
    const shopMetaDataDetails = await ShopMetaDataService.getAllMetaData(shopIds);
    const shopMetaDataDetailsObject = shopMetaDataDetails.reduce((a, v) => ({ ...a, [v.shop_id]: v }), {});
    for (const shop of result) {
      shop.deliveryCharges = deliveryChargesConstant;
      shop.deliveryDistanceLimit = 10
      shop.store_meta = [shopMetaDataDetailsObject[shop.shop_id]];
      shop.categories = shopMetaDataDetailsObject[shop.shop_id]?.categories ?? [];
      shop.seller = {
        phone: usersObject[shop.user_id]?.phone,
        personalInfo: usersObject[shop.user_id]?.basicInformation?.personalDetails,
      };
      data.push(shop);
    }
    const response = { stores: data };
    // const response = { stores: result };
    const uniqueid = `${lon}_${lat}`;
    // const uniqueid =
     const uniqueKey = uniqueS3Key('Store_meta_Data', uniqueid);
     uploadJSONtoS3(uniqueKey, response);
     const jsonURL = await getJsonUrl(uniqueKey);
     console.log(jsonURL);
    return response;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};
module.exports = {
  getShopMetaData,
  getAllShopMetaData,
};
