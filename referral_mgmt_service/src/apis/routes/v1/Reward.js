const express = require("express");

// Todo: User some module-alias
const { HttpResponseHandler , Logger:log} = require("sarvm-utility");
const { RewardsController } = require("@controllers/v1");
const { system_token } = require("@config");

const Schemas = require("@root/src/common/libs/Validation/Schemas");
const { validate } = require("@root/src/common/libs/Validation/Validation");
const { route } = require("./Referral");
const router = express.Router();

router.put("/", async (req, res, next) => {
  //Done
  log.info({info:'Reward Route :: inside put API'})
  try {
    const { authPayload: user } = req;
    const updates = req.body;
    const data = await RewardsController.updateRewardStatus(updates);
    console.log(data);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error});
    next(error);
  }
});

router.get("/migrateSuccSub", async (req, res, next) => {
  //Done
  log.info({info:'Reward Route :: inside put API'})
  try {
    const { authPayload: user } = req;
    const data = await RewardsController.migrateSuccessfulSubscription();
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    log.error({error:error});
    next(error);
  }
});

module.exports = router;
