const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const axios = require('axios');

const { loadBalancer, system_token } = require('@config');

const masterCatalog = async () => {
  log.info({info: 'Retailer Service :: Inside master catalog'})
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/cms/apis/v1/metadata/mastercatalog`,
      headers: {
        Authorization: `Bearer ${system_token}`,
      },
    };

    const result = await axios(config);

    return result.data.data;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

module.exports = { masterCatalog };
