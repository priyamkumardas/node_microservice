const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
  Logger,
} = require('sarvm-utility');
const { DATA_BASE_ERROR } = require('../../../common/libs/ErrorHandler');
const { Consumer } = require('@root/src/apis/models');
const { v4: uuidv4 } = require('uuid');
const { uploadProfileToS3 } = require('@root/src/common/libs/JsonToS3/JsonToS3');
const config = require('@config');
const axios = require('axios');

const getS3JsonData = async (url) => {
  try {
    const response = await axios.get(url);
    const json = response.data;
    return json;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR('Axios Error - while fetching data from s3 url');
  }
};

function mergeObjects(obj1, obj2) {
  const mergedObj = { ...obj1 };
  for (const key in obj2) {
    if (typeof obj2[key] === 'object' && obj2[key] !== null && !(obj2[key] instanceof Array)) {
      if (!mergedObj[key]) {
        mergedObj[key] = {};
      }
      mergeObjects(mergedObj[key], obj2[key]);
    } else if (mergedObj.hasOwnProperty(key)) {
      mergedObj[key] = obj2[key];
    } else {
      mergedObj[key] = obj2[key];
    }
  }
  return mergedObj;
}

const createProfile = async (userId, data) => {
  log.info({ info: 'Consumer Service :: inside create profile' });
  try {
    let uniqueKey;
    let profile;

    const prevProfile = await Consumer.find({ userId: userId });
    if (prevProfile.length) {
      uniqueKey = `consumer/${prevProfile[0].guid}`;

      let s3ProfileData = await getS3JsonData(prevProfile[0].s3URL);

      let updatedProfile = mergeObjects(data, s3ProfileData);
      await uploadProfileToS3(uniqueKey, data);

      return updatedProfile;
    }

    let guid = uuidv4();
    uniqueKey = `consumer/${guid}`;

    log.info({ info: 'Consumer Service :: uploading profile to S3' });
    await uploadProfileToS3(uniqueKey, (data = {}));

    let profileData = {
      userId: userId,
      guid: guid,
      s3URL: `${config.media_s3}/${uniqueKey}/profile.json`,
    };  

    profile = await Consumer.create(profileData);
    return profile;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error while creating GUID in DB');
  }
};

const getUserProfileByGuidFromConsumer = async (args) => {
    try {
        return await Consumer.find({guid: args.guid})
    } catch(err) {
      console.log(err);
      throw new DATA_BASE_ERROR('Error while traversing GUID in DB');

    }
}

const getProfileByUserIdFromConsumer = async (args) => {
  try {
    return await Consumer.find({userId: args.userId})
} catch(err) {
  console.log(err);
  throw new DATA_BASE_ERROR('Error while traversing GUID in DB');

}
}

module.exports = {
  createProfile,
  getUserProfileByGuidFromConsumer,
  getProfileByUserIdFromConsumer
};
