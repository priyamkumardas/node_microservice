const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require('sarvm-utility');

const { loadBalancer, systemToken } = require('@config');
const saveFCMToken = async (userId, deviceId, fcmToken, appName) => {
  try {
    const config = {
      baseURL: loadBalancer,
      timeout: 2000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        // app_name: appName,
        app_version_code: 101,
        Authorization: 'Bearer ' + systemToken,
      },
    };
    const payload = {
      userId,
      deviceId,
      fcmToken,
      appName,
    };
    const response = await request.post(`/ms/apis/v1/notification/fcm-token`, payload, options);

    if (response) {
      // throw new Error('failed');
      return false;
    }
    return response;
  } catch (err) {
    console.log("error inside FCM token");
    // throw new Error('failed');
    return false;
  }
};

module.exports = { saveFCMToken };
