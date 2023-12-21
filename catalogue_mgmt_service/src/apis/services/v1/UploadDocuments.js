// eslint-disable-next-line import/no-unresolved

const { getUploadURL, getImageUrl } = require('@root/src/common/libs/FileHandler/CloudFileHandler');
const { Logger: log } = require('sarvm-utility');

const amazonPresignedUrl = async (key) => {
  log.info({ info: 'Inside amazon presigned url' });
  try {
    const result = await getUploadURL(key);
    return result;
  } catch (error) {
    log.error({ error: error });
  }
};

const imageUrl = (key) => {
  log.info({ info: 'Inside image url' });
  try {
    const result = getImageUrl(key);
    return result;
  } catch (error) {
    log.error({ error: error });
  }
};
module.exports = { amazonPresignedUrl, imageUrl };
