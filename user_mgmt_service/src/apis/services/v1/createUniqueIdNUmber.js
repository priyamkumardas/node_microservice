const { createUUID } = require('@common/libs/UUID/UUIDV4');

const createKey = (service, docType) => {
  const uuid = createUUID();
  const key = `documents/${service}/${docType}/${uuid}`;
  return key;
};

module.exports = { createKey };
