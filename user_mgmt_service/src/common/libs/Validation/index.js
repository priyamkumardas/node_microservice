const ajvInstance = require('./ajv-instance');
const Otp = require('./Otp');
const Employee = require('./Employee');
const User = require('./User');
const Address = require('./Address');
const Favourite = require('./Favourite');

module.exports = {
  ajvInstance,
  ...Otp,
  ...Employee,
  ...User,
  ...Address,
  ...Favourite,
};
