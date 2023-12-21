const errorConstants = require('./errorConstants');

const constants = require('./constants');
const deliveryConstant = require('./deliveryConstant');
const deliveryChargesConstant = require('./deliveryChargesConstant')
module.exports = Object.freeze({
  ...deliveryConstant,
  ...errorConstants,
  ...constants,
  ...deliveryChargesConstant
});
