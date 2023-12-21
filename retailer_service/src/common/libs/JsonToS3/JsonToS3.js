/* eslint-disable import/no-unresolved */
const AWS = require('aws-sdk');
const config = require('@config');
const { ERROR_UPLOADING_DATA } = require('@root/src/apis/errors');

// REMOVE id & secret after testing
AWS.config.update({
  region: 'ap-south-1',
});
const s3 = new AWS.S3();

const uploadRetailerDataToS3 = async (key, obj) => {
  try {
    const { products, categories, shop_id, user_id } = obj;

    const dataObj = { products, categories, shop_id, user_id };
    console.log({ obj });
    dataObj.products = products.filter((item) => item.status === 'published');
    console.log({ dataObj });

    const buf = Buffer.from(JSON.stringify(dataObj));

    const data = {
      Bucket: config.aws.s3.bucket,
      Key: key,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'application/json',
      ACL: 'public-read',
    };

    const result = await s3.upload(data).promise();
    return result;
  } catch (error) {
    throw new ERROR_UPLOADING_DATA(error);
  }

  // return response;
};

const uploadProfileToS3 = async (key, data) => {
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

const getProfileJSONS3 = async (key) => {
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

const uploadJSONtoS3 = async (key, data) => {
  try {
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
    throw new ERROR_UPLOADING_DATA(error);
  }

  // return response;
};

const getJsonUrl = async (key) => {
  const url = `${config.media_s3}/${key}`;
  //{s3url}/retailer/{shopid}
  return url;
};

module.exports = { uploadRetailerDataToS3, getJsonUrl, uploadJSONtoS3, uploadProfileToS3, getProfileJSONS3 };
