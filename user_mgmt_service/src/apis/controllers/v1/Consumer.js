const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
  Logger,
} = require('sarvm-utility');
const { ConsumerService } = require('@services/v1');

const createProfile = async (args) => {
  log.info({ info: 'Consumer Controller :: inside create profile' });
  let { userId, proData } = args;
  let result = await ConsumerService.createProfile(userId, proData);
  return result;
};

const getUserProfileByGuidFromConsumer = async (args) => {
  return await ConsumerService.getUserProfileByGuidFromConsumer({ guid: args.guid });
};

const getUserProfileByUserIdFromConsumer = async (args) => {
  return await ConsumerService.getProfileByUserIdFromConsumer({ userId: args.userId });
};

module.exports = {
  createProfile,
  getUserProfileByGuidFromConsumer,
  getUserProfileByUserIdFromConsumer,
};
