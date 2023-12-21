const axios = require('axios');
const { loadBalancer, system_token } = require('@config');
const { LOGISTIC_SERVICE_ERROR } = require('@root/src/apis/errors');
const { Logger: log } = require('sarvm-utility');

const addDeliveryBoyToShop = async (args) => {
  log.info({info: 'Retailer Service :: Inside add delivery boy to shop'})
  try {
    const req = JSON.stringify(args);
    const config = {
      method: 'post',
      url: `${loadBalancer}/lms/apis/v1/deliveryBoy`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data: req,
    };

    const result = await axios(config);
    const { data } = result;
    const response = data.data;

    return response;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};
const getAllListOfAllDeliveryBoy = async () => {
  log.info({info: 'Retailer Service :: Inside get all list of delivery boy'})
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/lms/apis/v1/deliveryBoy/all`,
      // url: 'http://localhost:1200/lms/apis/v1/deliveryBoy/all',
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios(config);

    const { data } = response.data;

    return data;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

const getAllDeliveryBoys = async (shopId) => {
  log.info({info: 'Retailer Service :: Inside get all delivery boys'})
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/lms/apis/v1/deliveryBoy/${shopId}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
    };

    const response = await axios(config);

    const { data } = response.data;

    return data;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

const createDeliveryBoy = async (args) => {
  log.info({info: 'Retailer Service :: Inside create delivery boy for shop'})
  try {
    const config = {
      method: 'post',
      url: `${loadBalancer}/lms/apis/v1/deliveryBoy/create`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data: JSON.stringify(args)
    };
    const response = await axios(config);
    const { data } = response.data;
    return data;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};



module.exports = { addDeliveryBoyToShop, getAllListOfAllDeliveryBoy, createDeliveryBoy, getAllDeliveryBoys };
