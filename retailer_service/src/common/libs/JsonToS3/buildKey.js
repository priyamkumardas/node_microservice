const uniqueS3Key = (serviceName, uniqueId) => {
  const key = `${serviceName}/${uniqueId}`;
  return key;
};

module.exports = { uniqueS3Key };
