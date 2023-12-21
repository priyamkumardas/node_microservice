const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger:log
} = require("sarvm-utility");

const { AlertService } = require("@root/src/apis/services/v1");

const alertSubscription = async (userId) => {
  log.info({info: 'Controller :: inside alert Subscription'})
  const data = await AlertService.alertSubscription(userId);
  return data;
};

module.exports = {
  alertSubscription,
};
