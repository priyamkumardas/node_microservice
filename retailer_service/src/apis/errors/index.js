const ShopErrors = require('./Shop');
const CommonErrors = require('./CommonError');
const orderService = require('./orderService');
const logisticService = require('./logisticService');

module.exports = {
  ...ShopErrors,
  ...CommonErrors,
  ...orderService,
  ...logisticService,
};
