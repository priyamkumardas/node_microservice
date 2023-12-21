// eslint-disable-next-line import/no-unresolved

const { getUploadURL, getImageUrl } = require('@root/src/common/libs/FileHandler/CloudFileHandler');
const { Logger } = require('sarvm-utility');

const amazonPresignedUrl = async (key) => {
  try {
    const result = await getUploadURL(key);
    return result;
  } catch (error) {
    Logger.error({error:error})
  }
};

const imageUrl = (key) => {
  try {
    const result = getImageUrl(key);
    return result;
  } catch (error) {
    Logger.error({error:error})
  }
};
module.exports = { amazonPresignedUrl, imageUrl };
