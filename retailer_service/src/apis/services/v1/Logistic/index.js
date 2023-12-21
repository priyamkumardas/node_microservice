const axios = require('axios');
const { system_token, loadBalancer } = require('@root/src/config');
const { LOGISTIC_SERVICE_ERROR } = require('../../../errors');

const { Logger: log } = require('sarvm-utility');

const getTripDetailByOrderId = async (orderId) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/lms/apis/v1/trip/${orderId}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data: { data } } = await axios(config);
    const result = data;
    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};
const updateTrip = async (params) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const data = JSON.stringify(params);

    const config = {
      method: 'put',
      url: `${loadBalancer}/lms/apis/v1/trip/updatePayment`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = await axios(config);

    const result = response.data.data;

    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};
const getTripDetailByOrderIds = async (orderIds) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/lms/apis/v1/trip/tripByOrderIds?orderIds=${orderIds}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
    };

    const { data: { data } } = await axios(config);
    const result = data;
    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

const assignOrderToLogisticService = async (params) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const data = JSON.stringify(params);

    const config = {
      method: 'post',
      url: `${loadBalancer}/lms/apis/v1/trip/createTrip`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = await axios(config);

    const result = response.data;

    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

const updateTripByOrderId = async (params) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const data = JSON.stringify(params);

    const config = {
      method: 'put',
      url: `${loadBalancer}/lms/apis/v1/trip/updateTrip`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = await axios(config);

    const result = response.data.data;

    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

const createNotification = async (params) => {
  log.info({ info: 'Retailer Service :: Inside assign order to logistic service' })
  try {
    const data = JSON.stringify(params);

    const config = {
      method: 'post',
      url: `${loadBalancer}/lms/apis/v1/notification`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data,
    };

    const response = await axios(config);

    const result = response.data.data;

    return result;
  } catch (error) {
    throw new LOGISTIC_SERVICE_ERROR(error);
  }
};

module.exports = { assignOrderToLogisticService, updateTrip, getTripDetailByOrderId, updateTripByOrderId, getTripDetailByOrderIds, createNotification };
