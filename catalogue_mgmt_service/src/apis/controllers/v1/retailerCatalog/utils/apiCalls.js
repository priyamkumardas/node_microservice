var axios = require('axios');
const { Logger: log } = require('sarvm-utility');

const apiData = async (url) => {
  try {
    var config = {
      method: 'get',
      url,
      headers: {},
    };

    const response = await axios(config);

    return response.data;
  } catch (error) {
    log.error({ error: error });
    return error;
  }
};

module.exports = { apiData };
