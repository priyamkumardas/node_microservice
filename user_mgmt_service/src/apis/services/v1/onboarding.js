const axios = require('axios');
const { loadBalancer, systemToken } = require('@config');
const {Logger:log} =  require('sarvm-utility');

const retailers = async () => {
  log.info({info: 'inside get user'});
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/onbs/apis/v1/onboarding/retailer`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${systemToken}`,
      },
    };

    const result = await axios(config);
    const { data } = result;
    if (data != null) {
      return data.data;
    }

    return data;
  } catch (error) {
    return error;
  }
};

module.exports = { retailers };
