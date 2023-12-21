const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger:log
} = require("sarvm-utility");

const axios = require("axios");

const { UMS_API_CALL_ERROR } = require("@root/src/apis/errors");

const { load_balancer, system_token } = require("@root/src/config");

const UMS_GETUSER = load_balancer + "/ums/apis/v1/users/";
const subUrl = `${load_balancer}`;

const getSubscriptionbyShopId = async (shopId) => {
  log.info({info:'Subscription Service :: inside get subscription by shopId'});
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 5000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
      },
    };
    let getSubUrl = `sub/apis/v1/subscription/${shopId}`;
    const response = await request.get(getSubUrl, options);
    return response.data.data.subscriptionDetails;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

const checkSubscriptionStatus = async (shopId) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 5000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
      },
    };
    let getSubUrl = `sub/apis/v1/subscription/${shopId}`;
    const response = await request.get(getSubUrl, options);
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};

const getLogisticSubscriptionByPhone = async (phone) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 5000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
      },
    };
    let getSubUrl = `sub/apis/v1/subscription/status/V2/la/${phone}`;
    const response = await request.get(getSubUrl, options);
    return response.data.data;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
}

module.exports = {
  getSubscriptionbyShopId,
  checkSubscriptionStatus,
  getLogisticSubscriptionByPhone,
};
