const { createUUID } = require('@root/src/common/libs/uuid/uuid4');

const createKey = (type) => {
  const uuid = createUUID();
  const key = `${type}/${uuid}`;
  return key;
};

module.exports = { createKey };
