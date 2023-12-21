const uuid = require('uuid');

const uniqueId = () => {
  const uniqueid = uuid.v4();
  return uniqueid;
};

module.exports = { uniqueId };
