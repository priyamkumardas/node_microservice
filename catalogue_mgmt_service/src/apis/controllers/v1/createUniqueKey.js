const { createUUID } = require('@root/src/common/libs/uuid/uuid4');
const { Logger: log } = require('sarvm-utility');

const createKey = (type) => {
  log.info({ info: 'Creating key' });
  const uuid = createUUID();
  const key = `${type}/${uuid}.jpg`;
  return key;
};

module.exports = { createKey };
