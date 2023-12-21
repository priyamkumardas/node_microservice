// const { Logger } = require('sarvm-utility');
const { promisify } = require('util');

const AWS = require('aws-sdk');
const {
  aws: {
    s3: { bucket, urlExpirationTime },
  },
  media_cdn,
} = require('@config');

const s3 = new AWS.S3({
  signatureVersion: 'v4',
  region: 'ap-south-1',
});

const uploadJSONFile = async (key, jsonContent) => {
  try {
    const putObject = promisify(s3.putObject).bind(s3);
    const s3Params = {
      Bucket: bucket,
      Key: `reports/order_aggregate/${key}`,
      Body: jsonContent,
      Expires: parseInt(urlExpirationTime, 10),
    };

    const uploadJSON = await putObject(s3Params);
    console.log(`Data for shop JSON uploaded to AWS S3`);

    return uploadJSON;
  } catch (error) {
    console.log(`Error uploading data for JSON to AWS S3:`, error);
    throw error;
  }
};

module.exports = {
  uploadJSONFile,
};
