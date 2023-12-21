const { uuid } = require('uuidv4');

const createUUID = () => {
  const uniqeNumber = uuid();
  return uniqeNumber;
};

module.exports = { createUUID };
