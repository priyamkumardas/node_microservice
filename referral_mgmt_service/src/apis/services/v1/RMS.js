const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger:log
} = require("sarvm-utility");
// const {Logger:log}=require('sarvm-utility');
const axios = require("axios");

const { load_balancer, system_token } = require("@root/src/config");

const RMS_GETSHOP = load_balancer + "/rms/apis/v1/shop";

const getShopDetails = async (userId) => {
  log.info({info:'RMS service :: inside get shop details'});
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
    data: {
      userId: userId,
    },
  };
  let res = {};
  try {
    res = await axios.get(RMS_GETSHOP, options);
  } catch (err) {
    console.log("GET SHOP ERROR");
    console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result[0]) {
      return result[0];
    } else {
      return "000000";
    }
  } else {
    throw new Error(error.code);
  }
};
const getPincode = async (userId) => {
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
    data: {
      userId: userId,
    },
  };
  let res = {};
  try {
    res = await axios.get(RMS_GETSHOP, options);
  } catch (err) {
    console.log("GET PIN CODE ERROR");
    console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result[0]) {
      return result[0].pincode;
    } else {
      return "000000";
    }
  } else {
    throw new Error(error.code);
  }
};
const getAllStores = async (appName) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 10000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_name: appName,
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
        longitude: 0,
        latitude: 0,
        distance: 0,
      },
    };
    let getStoresUrl = "/rms/apis/v1/shop";
    const response = await request.get(getStoresUrl, options);
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

const assignManagerToRetailer = async (managerId, retailerId) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 10000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_name: "householdApp",
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
      },
    };
    const data = {
      managerId: managerId,
      retailerId: retailerId,
    };
    let getStoresUrl = "/rms/apis/v1/shop/manager/";
    const response = await request.post(getStoresUrl, data, options);
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

const getManagerOfRetailer = async (shopId) => {
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
  };
  let res = {};
  try {
    const GET_MANAGER_RETAILER =
      load_balancer + "/rms/apis/v1/shop/manager/" + shopId;
    res = await axios.get(GET_MANAGER_RETAILER, options);
  } catch (err) {
    console.log("GET SHOP ERROR");
    console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result) {
      return result;
    } else {
      return null;
    }
  } else {
    throw new Error(error.code);
  }
};

const getShopId = async (shopId) => {
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
  };
  let res = {};
  try {
    const GET_SHOP_ID = load_balancer + "/rms/apis/v1/shop/" + shopId;
    res = await axios.get(GET_SHOP_ID, options);
  } catch (err) {
    console.log("GET SHOP ERROR");
    console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result) {
      return result[0];
    } else {
      return null;
    }
  } else {
    throw new Error(error.code);
  }
};
module.exports = {
  getShopDetails,
  getPincode,
  getAllStores,
  assignManagerToRetailer,
  getManagerOfRetailer,
  getShopId,
};
