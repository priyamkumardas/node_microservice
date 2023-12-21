const axios = require('axios');
const { loadBalancer, systemToken } = require('@config');
const { getShopProfileS3, uploadProfileToS3 } = require('@common/libs/JsonToS3/JsonToS3');

const updateDummySubscription = async (userId) => {
  try {
    const config = {
      method: 'patch',
      url: `${loadBalancer}/rms/apis/v1/shop/dummySubscription?userId=${userId}`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${systemToken}`,
      },
      data: {
        hasDummySub: `true`,
      },
    };
    const result = await axios(config);
    if (result != null) {
      if (result.data != null) {
        if (result.data.data != null) {
          return result.data.data;
        }
      }
    }
    return null;
  } catch (error) {
    console.log(error);
    // throw new ORDER_SERVICE_ERROR(error);
  }
};

const getShopsByRetailerId = async (retailerId) => {
  // /retailerAndShop/:retailerId
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/rms/apis/v1/shop/retailerAndShop/${retailerId}`,
      headers: {
        app_name: 'householdApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${systemToken}`,
      },
    };
    const result = await axios(config);
    if (result?.data?.data?.shopData) {
      return result.data.data.shopData;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    // throw new ORDER_SERVICE_ERROR(error);
  }
};

const getShopByUniqueId = async (id) => {
  // /retailerAndShop/:retailerId
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/rms/apis/v1/shop/shopDetails/${id}`,
      headers: {
        app_name: 'householdApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${systemToken}`,
      },
    };
    const result = await axios(config);
    if (result?.data?.data) {
      return result.data.data[0];
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    // throw new ORDER_SERVICE_ERROR(error);
  }
};

const createRetailerInRetailer = async (user_id) => {
  try {
    const config = {
      method: 'post',
      url: `${loadBalancer}/rms/apis/v1/retailer/${user_id}`,
      headers: {
        app_name: 'retailerApp',
        app_version_code: '101',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${systemToken}`,
      },
    };
    const result = await axios(config);
    if (result?.data) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    // throw new ORDER_SERVICE_ERROR(error);
  }
};

const updateShopProfile = async (guid, basicInformation) => {
  try {
    const uniqueKey = `shops/${guid}`;

    let prevProfile = await getShopProfileS3(uniqueKey);
    let data = Object.assign(prevProfile, { basicInformation: basicInformation || '' });
    await uploadProfileToS3(uniqueKey, data);

    return true;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

module.exports = {
  updateDummySubscription,
  getShopsByRetailerId,
  getShopByUniqueId,
  createRetailerInRetailer,
  updateShopProfile,
};
