const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require('sarvm-utility');
const ExcelJS = require('exceljs');
const moment = require('moment');
const { isDate } = require('@common/utility/dateUtil');
const { ReportService } = require('@root/src/apis/services/v1');
const { uploadJSONFile } = require('../../../common/libs/FileHandler/CloudFileHandler.js');
const { shopLists } = require('../../models/Shop.js');
const path = require('path');
const { Console } = require('console');

const generateReportCatalog = async (startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get generate Report Catalog'})
  const data = await ReportService.generateReportCatalog(startDate, endDate);
  return data;
};
const generateReportTxn = async (startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get generate Report Txn'})
  const data = await ReportService.generateReportTxn(startDate, endDate);
  return data;
};
const generateReportSubscription = async (startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get generate Report Subscription'})
  const data = await ReportService.generateReportSubscription(startDate, endDate);
  return data;
};
const generateReportEmployee = async (startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get generate Report Employee'})
  const data = await ReportService.generateReportEmployee(startDate, endDate);
  return data;
};

const getEmployeeData = (users, employeesByEmpolyeId, refByPhone) => {
  const user = users[refByPhone];
  const managerId = user.employee.managerId;
  const managerName = employeesByEmpolyeId[managerId].fullName;
  const organizationId = user.employee.org_id;

  return { organizationId, managerId, managerName };
};

const getShopData = (users, phone_number, type) => {
  const data = users[phone_number];
  if (!data || !data.shop || type === 'INDIVIDUAL') {
    return {
      latitude: 'Null',
      longitude: 'Null',
      isSignUp: 'No',
      isSubscribed: false,
      isKYCVerified: false,
      city: 'Null',
      state: 'Null',
      pinCode: 'Null',
      shopId: 'Null',
      txnAmount: 0,
      isCatalog: 'No',
    };
  }
  const { shop, retailer } = data;

  const catalog = shop.catalog === undefined ? [] : [...shop.catalog.catalog];

  const latitude = shop.latitude;
  const longitude = shop.longitude;
  const isSignUp = retailer.isOtpVerified;
  const isSubscribed = shop.isSubscribed || false;
  const isKYCVerified = shop.isKYCVerified || false;
  // const shopId = shop.shop_id;
  const city = shop.city;
  const state = shop.state;
  const pinCode = shop.pincode;
  const txnAmount = isSubscribed === true ? 499 : 0;
  const catalogData = catalog;
  let isCatalog = 'No';

  return {
    latitude,
    longitude,
    isSignUp,
    isSubscribed,
    isKYCVerified,
    city,
    state,
    pinCode,
    txnAmount,
    isCatalog,
    catalogData,
  };
};

const generateReport = async (startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get generate Report '})
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Report');
  let results = [];

  try {
    const employees = {};
    const employeesByEmpolyeId = {};
    const employeeData = await ReportService.getAllEmployees();
    employeeData.forEach((employee) => {
      employees[employee.userId] = employee;
      employeesByEmpolyeId[employee.employeeId] = employee;
    });

    const shops = {};
    const shopData = await ReportService.getAllShops();
    shopData.forEach((shop) => {
      shops[shop.user_id] = {
        ...shop,
      };
    });

    const catalogData = await ReportService.getCatalog();
    catalogData.forEach(({ catalog }) => {
      try {
        if (catalog.retailer || catalog.user_id) {
          const retailerId = catalog.retailer === undefined ? catalog.user_id : catalog.retailer.id;
          shops[retailerId].catalog = catalog;
        }
      } catch (error) {
        console.error(`Error adding catalog to retailer: ${error}`);
      }
    });

    const users = {};
    const userData = await ReportService.getAllUsers();
    userData.forEach((user) => {
      users[user.phone] = {
        user: user._id.toString(),
        retailer: {
          isOtpVerified: user.retailerData.isOtpVerified,
        },
        shop: shops[user._id.toString()] || null,
        employee: employees[user._id.toString()] || null,
      };
    });

    const referrals = await ReportService.getAllReferrals(startDate, endDate);
    const result = [];
    for (let i = 0; i < referrals.length; i++) {
      const {
        refByPhone,
        phone_number,
        createdAt,
        refByUserType,
        type,
        location,
        comments,
        ratings,
      } = referrals[i];

      const { organizationId, managerId, managerName } = getEmployeeData(
        users,
        employeesByEmpolyeId,
        refByPhone
      );

      let {
        isSignUp,
        isSubscribed,
        isKYCVerified,
        city,
        state,
        pinCode,
        txnAmount,
        isCatalog,
        catalogData,
      } = getShopData(users, phone_number, type);

      const catalogExcel = {
        Dairy: 'No',
        Vegetables: 'No',
        Fruits: 'No',
        Meat: 'No',
        Fish: 'No',
        Grocery: 'No',
        Restaurant: 'No',
        Sweets: 'No',
        Flowers: 'No',
        Paan: 'No',
        'Home Foods': 'No',
        Bakery: 'No',
        'Pet Foods': 'No',
        Snacks: 'No',
        'Pooja Items': 'No',
        Pharmacy: 'No',
      };

      if (catalogData && catalogData.length > 0) {
        isCatalog = 'Yes';

        for (let k = 0; k < catalogData.length; k++) {
          const category = catalogData[k].name;
          if (catalogExcel.hasOwnProperty(category)) {
            catalogExcel[category] = 'Yes';
          }
        }
      }
      const data = {
        date: moment.utc(createdAt).utcOffset('+05:30').format('YYYY-MM-DD'),
        time: moment.utc(createdAt).utcOffset('+05:30').format('HH:mm:ss'),
        refByPhone,
        organizationId,
        managerId,
        managerName,
        latitude: location === undefined ? null : location.latitude,
        longitude: location === undefined ? null : location.longitude,
        phone_number,
        type,
        ratings,
        comments,
        isSignUp,
        isSubscribed,
        isKYCVerified,

        isCatalog,
        txnAmount,

        city,
        state,
        pinCode,

        ...catalogExcel,
      };

      result.push(data);
    }

    result.sort((a, b) => new Date(a.date) - new Date(b.date));

    worksheet.columns = [
      {
        header: 'Date',
        key: 'date',
      },
      {
        header: 'Time',
        key: 'time',
      },
      { header: 'Referred By', key: 'refByPhone' },
      { header: 'Organization Id', key: 'organizationId' },
      { header: 'Manager Id', key: 'managerId' },
      { header: 'Manager Name', key: 'managerName' },
      { header: 'Lat', key: 'latitude' },
      { header: 'Long', key: 'longitude' },
      { header: 'Referees (Referred to)', key: 'phone_number' },
      { header: 'Type', key: 'type' },
      { header: 'Rating', key: 'ratings' },
      { header: 'Comments', key: 'comments' },
      { header: 'SignUp', key: 'isSignUp' },
      { header: 'is_Subscribed', key: 'isSubscribed' },
      { header: 'is_KYCVerified', key: 'isKYCVerified' },
      { header: 'iscatalog Done', key: 'isCatalog' },
      { header: 'Txn Amount', key: 'txnAmount' },
      { header: 'City', key: 'city' },
      { header: 'State', key: 'state' },
      { header: 'Pin Code', key: 'pinCode' },
      { header: 'Dairy', key: 'Dairy' },
      { header: 'Vegetables', key: 'Vegetables' },
      { header: 'Fruits', key: 'Fruits' },
      { header: 'Meat', key: 'Meat' },
      { header: 'Fish', key: 'Fish' },
      { header: 'Grocery', key: 'Grocery' },
      { header: 'Restaurant', key: 'Restaurant' },
      { header: 'Sweets', key: 'Sweets' },
      { header: 'Flower', key: 'Flowers' },
      { header: 'Paan', key: 'Paan' },
      { header: 'Home Foods', key: 'Home Foods' },
      { header: 'Bakery', key: 'Bakery' },
      { header: 'Snacks', key: 'Snacks' },
      { header: 'Pet Foods', key: 'Pet Foods' },
      { header: 'Pooja Items', key: 'Pooja Items' },
      { header: 'Pharmacy', key: 'Pharmacy' },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.columns.forEach((column) => {
      column.width = column.header.length < 12 ? 12 : column.header.length;
    });

    result.forEach((result) => {
      worksheet.addRow(result);
    });

    const fileName = `SSO_Report_${moment().format('YYYY-MM-DDTHH:mm:ss')}.xlsx`;

    await workbook.xlsx.writeFile(fileName);

    console.log(`Report generated: ${fileName}`);
    return result;
  } catch (error) {
    console.error('Error generating report:', error);
  }
};

const getphone = async () => {
  const data = await ReportService.generateReports10();
  return data;
};

const getOrderAggregationReport = async (shopId, startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get Order Aggregation Report'})

  const aggregateOrders = {};
  let totalItems = 0;
  let totalWeight = 0;
  let totalLiter = 0;
  let totalPieces = 0;
  let totalPlates = 0;

  try {
    const data = await ReportService.getOrderAggregationReport(shopId, startDate, endDate);

    for (const order of data) {
      const orderDetails = order.orderItemDetails;
      totalItems += orderDetails.reduce((acc, item) => acc + parseFloat(item.qty), 0);
      for (const item of orderDetails) {
        const { name, id, image, qty, price, soldBy, unit } = item;
        const productKey = id;
        if (!aggregateOrders[productKey]) {
          aggregateOrders[productKey] = {
            productId: productKey,
            productName: name,
            productImage: image,
            totalQuantity: parseFloat(qty * unit),
            totalPrice: parseFloat(price),
            soldBy: soldBy,
          };
        } else {
          aggregateOrders[productKey].totalQuantity += parseFloat(qty * unit);
          aggregateOrders[productKey].totalPrice += parseFloat(price);
        }
        if (soldBy === 'Kg' || soldBy === 'Kgs') {
          totalWeight += parseFloat(qty * unit);
        } else if (soldBy === 'Ltr') {
          totalLiter += parseFloat(qty * unit);
        } else if (soldBy === 'Pcs') {
          totalPieces += parseFloat(qty * unit);
        } else if (soldBy === 'Plt') {
          totalPlates += parseFloat(qty * unit);
        }
      }
    }

    const orders = Object.values(aggregateOrders);

    const shopData = {
      aggregateOrders: {
        totalItems: orders.length,
        totalWeight: `${totalWeight !== 0 ? totalWeight.toFixed(2) + ' KG' : '0 KG'}`,
        totalLiter: `${totalLiter !== 0 ? totalLiter.toFixed(2) + ' Ltr' : '0 Ltr'}`,
        totalPieces: `${totalPieces} Pcs`,
        totalPlates: `${totalPlates} Plt`,
        orders: orders,
      },
    };

    // const fileName = `shop_${shopId}.json`;
    // const jsonContent = JSON.stringify(shopData);

    // await uploadJSONFile(fileName, jsonContent);
    // console.log(`Data for shop ${shopId} uploaded to AWS S3`);
    return shopData;
  } catch (error) {
    console.error(`Error uploading data for shop ${shopId} to AWS S3:`, error);
  }
};

const dateIsBefore = (date1, date2, format = 'YYYY-MM-DD') => {
  return moment(date1, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').isBefore(moment(date2, format));
};

const convertBoolean = (flag) => {
  return flag ? 1 : -1;
};

const groupOrdersByUser = (orderData) => {
  return orderData.reduce((group, order) => {
    const { userID } = order;
    group[userID] = group[userID] ?? {
      lastOrderDate: order.createdAt,
      orders: [],
    };
    group[userID].orders.push(order);
    return group;
  }, {});
};

const getCustomersListingForOrders = (orderDataGroupByUsers, usersMap, startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get Customers Listing For Orders'})
  const customers = [];
  Object.keys(orderDataGroupByUsers).map((userId) => {
    const { orders, lastOrderDate } = orderDataGroupByUsers[userId];
    const isActive = !dateIsBefore(lastOrderDate, startDate);
    let totalAmount = 0;
    let totalOrders = 0;
    orders.forEach((order) => {
      const isOrderConsidered = !dateIsBefore(lastOrderDate, startDate);
      totalAmount = !(isActive ^ isOrderConsidered)
        ? totalAmount +
          order.amount -
          order.discount +
          parseFloat(order.delivery.mode === 'DELIVERY' ? order.delivery.deliveryCharges : 0)
        : totalAmount;

      totalOrders = !(isActive ^ isOrderConsidered) ? totalOrders + 1 : totalOrders;
    });

    if (usersMap[userId]) {
      customers.push({
        userId,
        userPhoneNumber: usersMap[userId].phone ? usersMap[userId].phone : null,
        userStatus: isActive ? 'ACTIVE' : 'INACTIVE',
        lastOrderDate,
        totalOrders,
        totalAmount,
      });
    } else {
      console.log(`User with ID ${userId} is not found in the usersMap.`);
    }
  });
  return customers;
};

const arrayToMap = (array, key) => {
  return array.reduce((a, v) => ({ ...a, [v[key]]: v }), {});
};

const getTopCustomerReport = async (shopId, startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get Top Customer Report'})
  try {
    const orderData = await ReportService.getOrders(
      shopId,
      moment(endDate).subtract(1, 'M'),
      endDate
    );
    const orderDataGroupByUsers = groupOrdersByUser(orderData);
    const users = await ReportService.getUsers(Object.keys(orderDataGroupByUsers));
    const usersMap = arrayToMap(users, '_id');

    const customers = getCustomersListingForOrders(
      orderDataGroupByUsers,
      usersMap,
      startDate,
      endDate
    );

    customers.sort(
      (a, b) =>
        b.lastOrderDate > a.lastOrderDate ||
        b.totalAmount - a.totalAmount ||
        b.totalOrders - a.totalOrders
    );
    const aggregateAmount = { topCustomer: { customers } };
    return aggregateAmount;
  } catch (error) {
    console.log(error);
  }
};

const getUserDetailedOrders = async (shopId, userId, startDate, endDate) => {
  log.info({info: 'Report  Controller :: Inside get User Detailed Orders'})
  try {
    const activeOrderStatuses = new Set([
      'Received',
      'PICKEDUP',
      'DISPATCH',
      'Payment Received',
      'PROCESSING',
      'READY',
      'NEW',
      'ACCEPTED',
      'DISPATCHED',
      'TRUE',
      'IN_TRANSIT',
      'DELIVERED',
    ]);
    const orderHistoryStatuses = new Set(['COMPLETED', 'NO_SHOW', 'REJECTED']);

    const orderData = await ReportService.getUserDetailedOrders(shopId, userId, startDate, endDate);
    const aggregateOrders = {
      totalOrders: 0,
      totalAmount: 0,
      lastOrderDate: null,
      activeOrders: [],
      inactiveOrders: [],
    };

    for (const order of orderData) {
      if (activeOrderStatuses.has(order.status)) {
        aggregateOrders.activeOrders.push({
          id: order.orderID,
          amount:
            order.amount -
            order.discount +
            parseFloat(order.delivery.mode === 'DELIVERY' ? order.delivery.deliveryCharges : 0),
          image: order.orderItemDetails[0].image,
          date: order.createdAt,
          status: order.status,
          mode: order.delivery.mode,
        });
      } else if (orderHistoryStatuses.has(order.status)) {
        aggregateOrders.inactiveOrders.push({
          id: order.orderID,
          amount:
            order.amount -
            order.discount +
            parseFloat(order.delivery.mode === 'DELIVERY' ? order.delivery.deliveryCharges : 0),
          image: order.orderItemDetails[0].image,
          date: order.createdAt,
          status: order.status,
          mode: order.delivery.mode,
        });
      }
      aggregateOrders.totalAmount +=
        order.amount -
        order.discount +
        parseFloat(order.delivery.mode === 'DELIVERY' ? order.delivery.deliveryCharges : 0);
      if (!aggregateOrders.lastOrderDate || order.createdAt > aggregateOrders.lastOrderDate) {
        aggregateOrders.lastOrderDate = order.createdAt;
      }
    }
    aggregateOrders.activeOrders.sort((a, b) => b.date - a.date);
    aggregateOrders.inactiveOrders.sort((a, b) => b.date - a.date);
    aggregateOrders.totalOrders +=
      aggregateOrders.activeOrders.length + aggregateOrders.inactiveOrders.length;

    return aggregateOrders;
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateReportCatalog,
  generateReportTxn,
  generateReportSubscription,
  generateReportEmployee,
  generateReport,
  getphone,
  getOrderAggregationReport,
  getTopCustomerReport,
  getUserDetailedOrders,
};
