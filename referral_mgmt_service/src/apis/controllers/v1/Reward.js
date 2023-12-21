const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require("sarvm-utility");

const { RewardsService } = require("@root/src/apis/services/v1");

const updateRewardStatus = async (updates) => {
  log.info({info:'Reward Controller :: inside update Reward Status'});
  let successful = [];
  let failed = [];
  for (let i = 0; i < updates.length; i++) {
    // let rewardId = updates[i].rewardId;
    // let status = updates[i].status;
    let result = await RewardsService.updateRewardStatus(
      updates[i].rewardId,
      updates[i].status
    );
    if (result) {
      successful.push(updates[i].rewardId);
    } else {
      failed.push(updates[i].rewardId);
    }
  }
  return { successful, failed };
};

const migrateSuccessfulSubscription = async () => {
  log.info({info:'Reward Controller :: inside migrate Successful Subscription'});
  return RewardsService.migrateSuccessfulSubscription();
};

module.exports = {
  updateRewardStatus,
  migrateSuccessfulSubscription,
};
