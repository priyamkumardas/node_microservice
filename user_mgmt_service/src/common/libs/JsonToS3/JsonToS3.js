/* eslint-disable import/no-unresolved */
const AWS = require('aws-sdk');
const config = require('@config');

// REMOVE id & secret after testing
AWS.config.update({
  region: 'ap-south-1',
});
const s3 = new AWS.S3();

const getShopProfileS3 = async (key) => {
  const req = {
    Bucket: config.aws.s3.bucket,
    Key: `${key}/profile.json`,
  };

  try {
    const data = await s3.getObject(req).promise();
    const json = JSON.parse(data.Body.toString());
    json['s3URL'] = `https://s3.ap-south-1.amazonaws.com/${config.aws.s3.bucket}/${key}/profile.json`;
    return json;
  } catch (err) {
    console.error(err);
  }
};

// For Consumer
const uploadProfileToS3 = async (key, data) => {
  console.log(key);
  try {
    const dataToUpload = JSON.stringify(data);
    const req = {
      Bucket: config.aws.s3.bucket,
      Key: `${key}/profile.json`,
      Body: dataToUpload,
      ContentEncoding: 'base64',
      ContentType: 'application/json',
      ACL: 'public-read',
    };

    const result = await s3.putObject(req).promise();
    return result;
  } catch (error) {
    throw new ERROR_UPLOADING_DATA(error);
  }
};

module.exports = { uploadProfileToS3, getShopProfileS3 };
