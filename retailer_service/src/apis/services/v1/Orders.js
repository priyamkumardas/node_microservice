// TODO: CONSTANTS SHOULD BE THERE IN CONSTANT FILE
const { deliveryBoy, shop, sellar, delivery, payment, products, picker, user } = require('./orderMock');

const getOrders = ({ userId, status: reqStatus }) => {
  let status = '';
  switch (reqStatus) {
    case 'NEW': {
      status = 'NEW';
      break;
    }
    case 'ACCEPTED': {
      status = 'ACCEPTED';
      break;
    }
    case 'PROCESSING': {
      status = 'PROCESSING';
      break;
    }
    case 'DELIVERY': {
      status = 'DELIVERY';
      break;
    }
    case 'COMPLETED': {
      status = 'COMPLETED';
      break;
    }
    case 'CANCELLED': {
      status = 'CANCELLED';
      break;
    }
    case 'REJECTED': {
      status = 'REJECTED';
      break;
    }
    case 'NO_SHOW': {
      status = 'NO_SHOW';
      break;
    }
    case 'PAYMENT_PENDING': {
      status = 'PAYMENT_PENDING';
      break;
    }
    default: {
      throw new Error('Create a new Error for status not found');
    }
  }
  return {
    orders: [{ orderId: '2341234', status, amount: '590', deliveryBoy, shop, sellar, delivery, payment }],
  };
};
const getOrderById = () => {
  return {
    orderID: '98646923',
    status: 'IN_TRNASIT',
    amount: '590',
    products,
    delivery,
    payment,
    picker,
    user,
  };
};

const updateOrderStatus = ({ status, orderId }) => {
  return {
    data: true,
  };
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
};
