const AWS = require('aws-sdk');
const {
  aws: {
    s3: { bucket, urlExpirationTime },
  },
  media_cdn,
} = require('@config');

const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'ap-south-1' });

const getUploadURL = async (key) => {
  try {
    const s3Params = {
      Bucket: bucket,
      Key: key,
      Expires: parseInt(urlExpirationTime, 10),

      // Todo: ContentType and ContentLength Restriction should be implemented in Release 2
      // ContentType: "image/jpeg",
    };

    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
    return uploadURL;
  } catch (error) { }
};
const getImageUrl = (key) => {
  const url = `${media_cdn}/${key}`;
  return url;
};

module.exports = {
  getUploadURL,
  getImageUrl,
};
