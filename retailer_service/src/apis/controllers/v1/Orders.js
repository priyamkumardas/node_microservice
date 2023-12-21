const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');

const OrderService2 = require('../../services/v1/OrderService');
const LogisticService = require('../../services/v1/Logistic');
const ShopService = require('@services/v1/Shop');

const { INVALID_STATUS_MOVE, ORDER_NOT_FOUND, SHOP_NOT_FOUND_ERROR, TRIP_VALIDATION } = require('../../errors');
const { getUserDetails, getShopOwnerDetails } = require('../../services/v1/UserManagement');
const {
  getTripDetailByOrderIds,
  assignOrderToLogisticService,
  getTripDetailByOrderId,
  updateTripByOrderId,
  createNotification,
} = require('../../services/v1/Logistic');
const { STATUS } = require('@constants/orderStatus');

const Notification = require('@services/v1/MessagingService/Notification');

const moment = require('moment');
const creteResponseObjectForOrders = async (orders) => {
  const responseObject = [];

  // only take unique userIds
  if (orders.length > 0) {
    const usersIds = orders.map((item) => item.userID).join(';');
    const users = await getShopOwnerDetails(usersIds);
    const usersObject = users.reduce((a, v) => ({ ...a, [v._id]: v }), {});
    for (const element of orders) {
      const { orderID, userID, delivery, amount, discount, status, payment, orderItemDetails } = element;
      const userData = usersObject[userID];
      let orderTrip = await getTripDetailByOrderId(orderID);

      let laStatus = null;
      let deliveryBoyData;
      if (orderTrip.length > 0) {
        let finalStatus = orderTrip.filter((item) => item.status !== 'CANCELLED');
        laStatus = finalStatus?.length ? finalStatus[0].status : null;
        deliveryBoyData = finalStatus?.length ? await getUserDetails(finalStatus[0].userId) : {};
      }
      if (delivery && delivery.deliveryCharges) {
        delivery.deliveryCharges = Math.round(delivery.deliveryCharges);
      }
      if (status === STATUS.PICKEDUP) {
        const responseObjectElement = {
          laStatus,
          delivery,
          amount,
          discount,
          status: delivery.mode == 'PICKUP' ? STATUS.DELIVERY : status,
          payment,
          orderID,
          totalItems: orderItemDetails.length,
          deliveryBoy: deliveryBoyData,
          userDetails: {
            name: userData?.basicInformation?.personalDetails?.firstName,
            image:
              userData?.basicInformation?.personalDetails?.profileImage ||
              'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/Group+8121.svg',
            phone: userData?.phone,
          },
        };
        responseObject.push(responseObjectElement);
      } else {
        const responseObjectElement = {
          laStatus,
          delivery,
          amount,
          discount,
          status,
          payment,
          orderID,
          totalItems: orderItemDetails.length,
          deliveryBoy: {
            name: 'Test Test',
            phone: '9988776655',
          },
          userDetails: {
            name: userData?.basicInformation?.personalDetails?.firstName,
            image:
              userData?.basicInformation?.personalDetails?.profileImage ||
              'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/Group+8121.svg',
            phone: userData?.phone,
          },
        };
        responseObject.push(responseObjectElement);
      }
    }
  }

  return responseObject;
};

const createListOfPendingOrders = async (orders) => {
  const responseObject = [];

  if (orders.length > 0) {
    // only take unique userIds
    const usersIds = orders.map((item) => item.userID).join(';');
    const users = await getShopOwnerDetails(usersIds);
    const usersObject = users.reduce((a, v) => ({ ...a, [v._id]: v }), {});
    // const orderIds = orders.map((item) => item.orderID).join(';');
    // const trips = await getTripDetailByOrderIds(orderIds);

    for (const element of orders) {
      const { orderID, userID, delivery, amount, discount, status, payment } = element;
      const userData = usersObject[userID];
      let orderTrip = await getTripDetailByOrderId(orderID);

      let laStatus = null;
      if (orderTrip.length > 0) {
        let finalStatus = orderTrip.filter((item) => item.status !== 'CANCELLED');
        laStatus = finalStatus?.length ? finalStatus[0].status : null;
        deliveryBoyData = finalStatus?.length ? await getUserDetails(finalStatus[0].userId) : {};
      }
      if (delivery && delivery.deliveryCharges) {
        delivery.deliveryCharges = Math.round(delivery.deliveryCharges);
      }
      const responseObjectElement = {
        laStatus,
        delivery,
        amount,
        discount,
        status,
        payment,
        orderID,
        deliveryBoy: {
          name: 'Test',
          phone: '9988776655',
        },
        userDetails: {
          name: userData?.basicInformation?.personalDetails?.firstName,
          image:
            userData?.basicInformation?.personalDetails?.profileImage ||
            'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/Group+8121.svg',
          phone: userData?.phone,
        },
      };
      if (!payment.paid || !payment.acknowledged) responseObject.push(responseObjectElement);
    }
  }
  return responseObject;
};

const createListOfcompletedOrders = async (orders) => {
  const responseObject = [];

  if (orders.length > 0) {
    // only take unique userIds
    const usersIds = orders.map((item) => item.userID).join(';');
    const users = await getShopOwnerDetails(usersIds);
    const usersObject = users.reduce((a, v) => ({ ...a, [v._id]: v }), {});

    for (const element of orders) {
      const { orderID, userID, delivery, amount, discount, status, payment } = element;
      const userData = usersObject[userID];
      let orderTrip = await getTripDetailByOrderId(orderID);

      let laStatus = null;
      if (orderTrip.length > 0) {
        let finalStatus = orderTrip.filter((item) => item.status !== 'CANCELLED');
        laStatus = finalStatus?.length ? finalStatus[0].status : null;
        deliveryBoyData = finalStatus?.length ? await getUserDetails(finalStatus[0].userId) : {};
      }
      if (delivery && delivery.deliveryCharges) {
        delivery.deliveryCharges = Math.round(delivery.deliveryCharges);
      }
      const responseObjectElement = {
        laStatus,
        delivery,
        amount,
        discount,
        status,
        payment,
        orderID,
        deliveryBoy: {
          name: 'Rahul khichar',
          phone: '9988776655',
        },
        userDetails: {
          name: userData?.basicInformation?.personalDetails?.firstName,
          image:
            userData?.basicInformation?.personalDetails?.profileImage ||
            'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/Group+8121.svg',
          phone: userData?.phone,
        },
      };
      // if (status === STATUS.COMPLETED && amount === payment.amount) responseObject.push(responseObjectElement);
      if (status === STATUS.COMPLETED) responseObject.push(responseObjectElement);
    }
  }
  return responseObject;
};
const createListOfNoShowOrders = async (orders) => {
  const responseObject = [];

  if (orders.length > 0) {
    // only take unique userIds
    const usersIds = orders.map((item) => item.userID).join(';');
    const users = await getShopOwnerDetails(usersIds);
    const usersObject = users.reduce((a, v) => ({ ...a, [v._id]: v }), {});
    for (const element of orders) {
      const { orderID, userID, delivery, amount, discount, status, payment } = element;
      const userData = usersObject[userID];
      let orderTrip = await getTripDetailByOrderId(orderID);

      let laStatus = null;
      if (orderTrip.length > 0) {
        let finalStatus = orderTrip.filter((item) => item.status !== 'CANCELLED');
        laStatus = finalStatus?.length ? finalStatus[0].status : null;
        deliveryBoyData = finalStatus?.length ? await getUserDetails(finalStatus[0].userId) : {};
      }
      if (delivery && delivery.deliveryCharges) {
        delivery.deliveryCharges = Math.round(delivery.deliveryCharges);
      }
      const responseObjectElement = {
        laStatus,
        delivery,
        amount,
        discount,
        status,
        payment,
        orderID,
        deliveryBoy: {
          name: 'Test',
          phone: '9988776655',
        },
        userDetails: {
          name: userData?.basicInformation?.personalDetails?.firstName,
          image:
            userData?.basicInformation?.personalDetails?.profileImage ||
            'https://s3.ap-south-1.amazonaws.com/dev.sarvm.com/Group+8121.svg',
          phone: userData?.phone,
        },
      };
      responseObject.push(responseObjectElement);
    }
  }
  return responseObject;
};

const getOrders = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside get orders' });
  try {
    const { status, limit, offset, deliveryDate, orderQuery } = args;
    const { shopId } = args.shopId ? args : args.user;
    if (status === STATUS.PAYMENT_PENDING) {
      const orders = await OrderService2.getAllOrderByShopId(shopId, STATUS.DELIVERED, { limit, offset, deliveryDate, orderQuery });
      const pendingOrders = await createListOfPendingOrders(orders);
      return pendingOrders;
    }
    if (status === STATUS.COMPLETED) {
      const orders = await OrderService2.getAllOrderByShopId(shopId, 'COMPLETED', { limit, offset, deliveryDate, orderQuery });
      const completedOrders = await createListOfcompletedOrders(orders);
      return completedOrders;
    }

    if (status === STATUS.NO_SHOW) {
      const orders = await OrderService2.getAllOrderByShopId(shopId, STATUS.NO_SHOW, { limit, offset, deliveryDate, orderQuery });
      const completedOrders = await createListOfNoShowOrders(orders);
      return completedOrders;
    }
    if (status === STATUS.DELIVERY) {
      let data = [STATUS.DISPATCHED, STATUS.PICKEDUP, STATUS.IN_TRANSIT, STATUS.REACHED_DELIVERY_LOCATION];
      const orders = await OrderService2.getAllOrderByShopAndStatus(shopId, data, { limit, offset, deliveryDate, orderQuery });
      const completedOrders = await creteResponseObjectForOrders(orders);
      return completedOrders;
    }
    const orders = await OrderService2.getAllOrderByShopId(shopId, status, { limit, offset, deliveryDate, orderQuery });
    const responseObject = await creteResponseObjectForOrders(orders);
    return responseObject;
  } catch (error) {
    throw error;
  }
};

const getOrderById = async (args) => {
  try {
    log.info({ info: 'Retailer Controller :: Inside get order by id' });
    // Todo: Do validation on orderId
    const { orderId } = args;
    const order = await OrderService2.getOrderDetailsByOrderId(orderId);
    return order;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const checkValidMoveOrderStatus = async (orderId, newStatus) => {
  log.info({ info: 'checking valid move order status' });
  try {
    const prevoiusOrder = await OrderService2.getOrderDetailsByOrderId(orderId);
    if (prevoiusOrder === null || prevoiusOrder.length === 0) throw new ORDER_NOT_FOUND('order not found');

    const {
      status,
      delivery: { mode },
    } = prevoiusOrder;

    if (status === STATUS.REJECTED) {
      throw new INVALID_STATUS_MOVE('you can not move status to any status from REJECTED');
    } else if (status === STATUS.CANCELLED) {
      throw new INVALID_STATUS_MOVE('you can not move status to any status from CANCELLED');
    } else if (status === STATUS.DELIVERED) {
      if (mode == STATUS.PICKUP || newStatus == STATUS.COMPLETED) {
        return true;
      }
      throw new INVALID_STATUS_MOVE('you can not move status to any status from DELIVERED');
    } else if (status === STATUS.READY || status === STATUS.NEW || status === STATUS.ACCEPTED) {
      if (
        newStatus === STATUS.PICKEDUP ||
        newStatus === STATUS.CANCELLED ||
        newStatus === STATUS.NO_SHOW ||
        newStatus === STATUS.DELIVERY
      ) {
        return mode == STATUS.PICKUP ? STATUS.DELIVERED : newStatus;
      }
    } else if (status === STATUS.PROCESSING) {
      if (
        newStatus === STATUS.PICKEDUP ||
        newStatus === STATUS.CANCELLED ||
        newStatus === STATUS.NO_SHOW ||
        newStatus === STATUS.DELIVERY
      ) {
        return mode == STATUS.PICKUP ? STATUS.DELIVERED : newStatus;
      }
    } else if (status === STATUS.DISPATCHED || status === STATUS.READY) {
      if (newStatus === STATUS.PICKEDUP) {
        return mode == STATUS.PICKUP ? STATUS.DELIVERED : STATUS.IN_TRANSIT;
      }
    }
    return newStatus;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateOrderStatus = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside update order status' });
  // Todo: Do validation on each object
  try {
    const { status, orderId } = args;
    let deliveryStatus = status;
    if (status === STATUS.PICKEDUP) {
      let updatedStatus = await checkValidMoveOrderStatus(orderId, status);
      const result = await OrderService2.updateOrderStatus(orderId, updatedStatus);
      return result;
    }
    if (status === STATUS.DISPATCHED) {
      await checkValidMoveOrderStatus(orderId, status);
      const result = await OrderService2.updateOrderStatus(orderId, status, args.userDetails);
      return result;
    }
    if (status === STATUS.DELIVERY) {
      const status = await checkValidMoveOrderStatus(orderId, deliveryStatus);
      const result = await OrderService2.updateOrderStatus(orderId, status);
      return result;
    }
    await checkValidMoveOrderStatus(orderId, status);
    const result = await OrderService2.updateOrderStatus(orderId, status);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateDeliveryStatus = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside update delivery status' });
  try {
    const { orderId, mode, deliveryDate, deliverySlot, location, deliveryPerson } = args;

    const delivery = { mode, deliveryDate, deliverySlot, location, deliveryPerson };
    const result = await OrderService2.updateDeliveryStatus(orderId, STATUS.PICKEDUP, delivery);
    return result;
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updatePaymentStatus = async (args) => {
  try {
    log.info({ info: 'Retailer Controller :: Inside update payment status' });
    const { acknowledged, orderId } = args;
    let body = { acknowledged, paid: true, status: 'COMPLETED' };
    const result = await OrderService2.updatePaymentStatus(orderId, body);
    return result;

  } catch (err) {
    console.log(err, "[__ERR__]")
  }
};

const createTripForDeliveryBoy = async (params) => {
  log.info({ info: 'Retailer Controller :: Inside create trip for delivery boy' });
  try {
    const { deliveryBoyID, orderId, user } = params;
    const { shopId, userId } = user;
    const trip = await getTripDetailByOrderId(orderId);

    if (userId === deliveryBoyID) {
      return { success: true, data: 'This order successfully assign to retailer.' };
    }

    if (trip.length > 0) {
      let message = 'This order already assigned to someone.';
      throw new TRIP_VALIDATION(message);
    }
    if (!shopId) {
      throw new SHOP_NOT_FOUND_ERROR('shop not found');
    }
    const order = await OrderService2.getOrderDetailsByOrderId(orderId);
    const shopData = await ShopService.showShopDetailsByShopId(shopId);

    if (!shopData) {
      throw new SHOP_NOT_FOUND_ERROR('shop not found');
    }

    const { user_id, shop_name, longitude, latitude, shop_number, locality, landmark, city, street, image } =
      shopData[0];

    const { payment, delivery, products, user: { userID }, amount, instruction, discount } = order;

    const houseHoldUser = await getUserDetails(userID);

    const retailerUser = await getUserDetails(user_id);

    const { deliveryDate, location, deliveryCharges } = delivery;

    let retailerImage =
      retailerUser?.basicInformation !== undefined ? retailerUser.basicInformation.personalDetails.profileImage : '';

    const pickUp = {
      time: new Date(),
      phoneNumber: retailerUser.phone,
      shopName: shop_name || '',
      shopImage: retailerImage,
      location: {
        lat: latitude.toString(),
        lon: longitude.toString(),
        address: `${city}, ${street}, ${locality}, ${shop_name}`,
      },
    };

    const { _id } = houseHoldUser;

    let userName =
      houseHoldUser.basicInformation !== undefined ? houseHoldUser.basicInformation.personalDetails.firstName : '';
    let userImage =
      houseHoldUser.basicInformation !== undefined ? houseHoldUser.basicInformation.personalDetails.profileImage : '';
    const dropOff = {
      userId: _id || '',
      time: new Date(),
      phoneNumber: houseHoldUser.phone,
      userName: userName,
      //add user Image after impl in ums
      userImage: userImage,
      location: {
        address: location.address,
        lat: location.lat.toString(),
        lon: location.lon.toString(),
      },
    };

    const deliveryInfo = {
      deliveryDate,
      deliveryCharges,
    };

    // order weight
    let orderWeight = 0;
    for (let order of products) {
      if (order.unit !== undefined && order.qty !== undefined) {
        orderWeight += order.unit * order.qty;
      }
    }

    const args = {
      retailerId: user_id,
      shopId: shopId.toString(),
      orderId,
      amountAfterDiscount: Number(amount) - Number(discount),
      discount,
      amount,
      currency: 'INR',
      userId: deliveryBoyID,
      pickUp,
      payment: {
        ...payment,
        amount: amount.toString(),
      },
      instruction: instruction ? instruction : 'not specified.',
      dropOff,
      deliveryInfo,
      orderItemDetails:products,
      orderWeight,
      status: 'NEW',
    };

    const result = await assignOrderToLogisticService(args);

    let message = 'You have received a trip request';
    let currentDate = moment().format('DD-MM-YYYY');
    let currentTime = moment().format('hh:mm a');
    let notificationBody = {
      status: 'NEW',
      tripId: result.data.tripId,
      deliveryBoyId: deliveryBoyID,
      message,
      date: currentDate,
      time: currentTime,
    };
    await createNotification(notificationBody);

    const dataObj = {
      body: 'You have received a trip request',
      title: 'New Trip Received',
      data: { message: JSON.stringify(result.data) },
      result: 'You have received a trip request',
      appName: 'logisticsDelivery',
      userId: deliveryBoyID,
    };
    await Notification.pushNotification({ dataObj });
    return {
      acknowledged: true,
      message: 'The order has been dispatched successfully.',
    };
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

const updateTripForDeliveryBoy = async (args) => {
  try {
    const {
      deliveryBoyID,
      orderId,
      user: { userId },
    } = args;
    const trips = await getTripDetailByOrderId(orderId);

    if (trips.length <= 0) {
      if (userId !== deliveryBoyID) {
        await createTripForDeliveryBoy(args);
        return {
          acknowledged: true,
          message: 'The order re-dispatch successfully.',
        };
        // let message = "This order's trip does not exist.";
        // throw new TRIP_VALIDATION(message);
      }
    }
    let trip = trips[0];
    if (trip.status === STATUS.ACCEPTED || trip.status === STATUS.PICKUP || trip.status === STATUS.REACHED_DL || trip.status === STATUS.DELIVERED || trip.status === STATUS.COMPLETED) {
      let message = `You cant re-dispatch delivery boy has ${trip.status.toLowerCase()} order.`;
      if (trip.status === STATUS.REACHED_DL) {
        message = `You cant re-dispatch because delivery boy has been reached delivery location.`
      }
      throw new TRIP_VALIDATION(message);
    }
    if (deliveryBoyID === trip.userId) {
      let data = {
        acknowledged: true,
        message: 'This order is already assigned to him.',
      };
      return data;
    }

    let status = 'CANCELLED';
    let body = { orderId, status: status };
    if (userId === deliveryBoyID) {
      await updateTripByOrderId(body);
      return { success: true, data: 'This order successfully assign to retailer.' };
    }
    const updateTrip = await updateTripByOrderId(body);
    trip.userId = deliveryBoyID;
    trip.status = 'NEW';
    trip.payment.amount = String(trip.payment.amount);
    trip.amountAfterDiscount = Number(trip.amountAfterDiscount);
    const createTrip = await assignOrderToLogisticService(trip);

    let message = 'You have received a trip request';
    let currentDate = moment().format('DD-MM-YYYY');
    let currentTime = moment().format('hh:mm a');
    let notificationBody = {
      status: 'NEW',
      tripId: trip.tripId,
      deliveryBoyId: deliveryBoyID,
      message,
      date: currentDate,
      time: currentTime,
    };
    await createNotification(notificationBody);

    const dataObj = {
      body: 'You have received a trip request',
      title: 'You have received a trip request',
      data: { message: JSON.stringify(trip) },
      result: 'You have received a trip request',
      appName: 'logisticsDelivery',
      userId: deliveryBoyID,
    };
    await Notification.pushNotification({ dataObj });

    if (updateTrip.acknowledged) {
      let data = {
        acknowledged: true,
        message: 'The order re-dispatch successfully.',
      };
      return data;
    }
    return createTrip;
  } catch (error) {
    console.log(error);
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updateDeliveryStatus,
  updatePaymentStatus,
  createTripForDeliveryBoy,
  updateTripForDeliveryBoy,
};
