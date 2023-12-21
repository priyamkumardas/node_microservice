const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require('sarvm-utility');
const axios = require('axios');
const conf = require('@config');

const {
  url: { INTERNAL_LOAD_BALANCER },
} = conf;

const logisticInformation = async (userId) => {
  try {
    const config = {
      method: 'get',
       url: `${INTERNAL_LOAD_BALANCER}/lms/apis/v1/profile/${userId}`,
      headers: {},
    };

    const response = await axios(config);
    const { data: { data } } = response;
    return data;
  } catch (error) {
    Logger.error({ error: error });
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

module.exports = { logisticInformation };
