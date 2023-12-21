const express = require("express");
const { AuthManager } = require("@common/libs");
const router = express.Router();

const ReferralsRouter = require("./Referral");
const RewardsRouter = require("./Reward");
//const ReportRouter = require("./Report");

router.use(
  "/ref",
  AuthManager.requiresScopes(["Users", "SYSTEM"]),
  ReferralsRouter
);

router.use(
  "/reward",
  AuthManager.requiresScopes(["Users", "SYSTEM"]),
  RewardsRouter
);
//router.use("/report", AuthManager.requiresScopes(["Users", "SYSTEM"]), ReportRouter);
module.exports = router;
