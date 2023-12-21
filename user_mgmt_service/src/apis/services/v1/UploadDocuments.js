const { putUploadURL } = require('@common/libs/FileHandler/CloudFileHandler');

const amazonPresignedUrl = async (key) => {
  const result = await putUploadURL(key);
  return result;
};

module.exports = { amazonPresignedUrl };
