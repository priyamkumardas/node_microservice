/* eslint-disable import/no-unresolved */
const AWS = require('aws-sdk');
const config = require('@config');
const { ERROR_UPLOADING_DATA } = require('@root/src/apis/errors');
const { Logger: log } = require('sarvm-utility');

AWS.config.update({
  region: 'ap-south-1',
});
const s3 = new AWS.S3();

const uploadJSONtoS3 = async (key, data) => {
  try {
    log.info({ info: 'inside uploadJSONtoS3 ' });
    const buf = Buffer.from(JSON.stringify(data));

    const req = {
      Bucket: config.aws.s3.bucket,
      Key: key,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'application/json',
      ACL: 'public-read',
    };

    const result = await s3.upload(req).promise();
    return result;
  } catch (error) {
    log.error({ error: error });
    throw new ERROR_UPLOADING_DATA(error);
  }
};

const getJsonUrl = async (key) => {
  const url = `${config.cdnUrl}/${key}`;
  return url;
};

const uniqueS3Key = (serviceName, uniqueId) => {
  const key = `${serviceName}/${uniqueId}`;
  return key;
};

module.exports = { getJsonUrl, uploadJSONtoS3, uniqueS3Key };
