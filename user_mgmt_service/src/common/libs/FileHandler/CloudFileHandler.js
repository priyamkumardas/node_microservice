const AWS = require('aws-sdk');
const {
  aws: {
    s3: { bucket, urlExpirationTime },
    cdnUrl,
  },
} = require('@config');

const s3 = new AWS.S3({ signatureVersion: 'v4', region: 'ap-south-1' });

const putUploadURL = async (key) => {
  const s3Params = {
    Bucket: bucket,
    Key: key,
    Expires: parseInt(urlExpirationTime, 10),

    // Todo: ContentType and ContentLength Restriction should be implemented in Release 2
    // ContentType: "image/jpeg",
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
  return {
    uploadURL,
    url: `${cdnUrl}/${key}`,
  };
};

module.exports = {
  putUploadURL,
};
