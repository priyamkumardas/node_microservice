const CategoryError = require('./CategoryError');
const CommonError = require('./CommonError');
const ProductError = require('./ProductError');

module.exports = {
  ...CategoryError,
  ...CommonError,
  ...ProductError,
};
