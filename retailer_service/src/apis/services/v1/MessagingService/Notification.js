const axios = require('axios');
const { loadBalancer, system_token } = require('@config');
const { MESSAGING_SERVICE_ERROR } = require('@root/src/apis/errors/MessagingService');
const { Logger: log } = require('sarvm-utility');

const pushNotification = async ({ dataObj }) => {
  log.info({ info: 'Retailer Service :: Inside push notification' });
  try {
    const url = `${loadBalancer}/ms/apis/v1/notification/push`;
    console.log('========================== > ', url);
    const httpOptions = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${system_token}`,
      },
    };
    let resutl = await axios.post(url, dataObj, httpOptions);
    return resutl;
  } catch (error) {
    log.warn(error);
    // throw new MESSAGING_SERVICE_ERROR();
  }
};

module.exports = {
  pushNotification,
};
