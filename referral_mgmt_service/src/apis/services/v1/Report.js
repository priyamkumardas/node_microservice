const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require("sarvm-utility");
const { load_balancer, system_token } = require("@root/src/config");
const sendSubscriptionAlertEmail = async (appName, userId) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 5000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_name: appName,
        app_version_code: 101,
        Authorization: `Bearer ${system_token}`,
      },
    };
    let getSubUrl = `/report/apis/v1/alert/subscription/${userId}`;
    const response = await request.get(getSubUrl, options);
    return response.data.data.subscriptionDetails;
  } catch (err) {
    throw new Error(JSON.stringify(err));
  }
};
module.exports = {
  sendSubscriptionAlertEmail,
};
