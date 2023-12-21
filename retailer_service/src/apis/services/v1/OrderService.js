const axios = require('axios');
const { loadBalancer, system_token } = require('@config');
const { ORDER_SERVICE_ERROR } = require('../../errors');

const { Logger: log } = require('sarvm-utility');

const getAllOrderByShopId = async (shopId, status, { limit, offset, deliveryDate, orderQuery }) => {
  log.info({ info: 'Retailer Service :: Inside get all order by shop id' })
  limit = limit ? Number(limit) : 100
  offset = offset ? Number(offset) : 0
  deliveryDate = deliveryDate ? deliveryDate : null
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/oms/apis/v1/retailer/${shopId}/${status}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
      },
      params: { limit, offset, deliveryDate, orderQuery }
    };

    const result = await axios(config);
    const { data } = result;
    const stores = data.data;

    return stores;
  } catch (error) {
    console.log(error,"ERROR")
    throw new ORDER_SERVICE_ERROR(error);
  }
};

const getAllOrderByShopAndStatus = async (shopId, status, { limit, offset, deliveryDate, orderQuery }) => {
  try {
    // const body = JSON.stringify({ status });
    limit = limit ? Number(limit) : 100
    offset = offset ? Number(offset) : 0
    deliveryDate = deliveryDate ? deliveryDate : null
    var config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `${loadBalancer}/oms/apis/v1/retailer/${shopId}/${status}`,
      headers: {
        "Authorization": `Bearer ${system_token}`,
        'Content-Type': 'application/json'
      },
      params: { limit, offset, deliveryDate, orderQuery }
    };

    const result = await axios(config);
    const { data } = result;
    const stores = data.data;

    return stores;
  } catch (error) {
    throw new ORDER_SERVICE_ERROR(error);
  }
};

const getOrderDetailsByOrderId = async (orderId) => {
  log.info({ info: 'Retailer Service :: Inside get order details by order id' })
  try {
    const config = {
      method: 'get',
      url: `${loadBalancer}/oms/apis/v1/retailer/detail?orderId=${orderId}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
      },
    };

    const result = await axios(config);
    const { data } = result;
    const stores = data.data;

    return stores;
  } catch (error) {
    throw new ORDER_SERVICE_ERROR(error);
  }
};

const updateOrderStatus = async (orderId, status, userDetails) => {
  log.info({ info: 'Retailer Service :: Inside update order status' })
  try {
    const req = JSON.stringify({
      status,
      userDetails: userDetails !== undefined ? userDetails : ""
    });
    const config = {
      method: 'put',
      url: `${loadBalancer}/oms/apis/v1/retailer/status/${orderId}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data: req,
    };

    const result = await axios(config);
    const { data } = result;
    const stores = data.data;

    return stores;
  } catch (error) {
    throw new ORDER_SERVICE_ERROR(error);
  }
};

const updateDeliveryStatus = async (orderId, status, delivery) => {
  log.info({ info: 'Retailer Service :: Inside update delivery status' })
  try {
    const req = JSON.stringify({
      status,
      delivery,
    });
    const config = {
      method: 'put',
      url: `${loadBalancer}/oms/apis/v1/retailer/status/${orderId}/dispatch`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data: req,
    };

    const result = await axios(config);
    const { data } = result;
    const stores = data.data;

    return stores;
  } catch (error) {
    throw new ORDER_SERVICE_ERROR(error);
  }
};

const updatePaymentStatus = async (orderId, args) => {
  log.info({ info: 'Retailer Service :: Inside update payment status' })
  try {
    const req = JSON.stringify({
      ...args,
    });
    const config = {
      method: 'put',
      url: `${loadBalancer}/oms/apis/v1/retailer/status/payment/${orderId}`,
      headers: {
        Authorization: `Bearer ${system_token}`,
        'Content-Type': 'application/json',
      },
      data: req,
    };

    const result = await axios(config);
    const { data } = result;
    const acknowledgedResponse = data.data;

    return acknowledgedResponse;
  } catch (error) {
    throw new ORDER_SERVICE_ERROR(error);
  }
};

module.exports = {
  getAllOrderByShopId,
  getOrderDetailsByOrderId,
  updateOrderStatus,
  updateDeliveryStatus,
  updatePaymentStatus,
  getAllOrderByShopAndStatus
};
