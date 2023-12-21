const express = require("express");
const { AuthManager } = require("@common/libs");
const router = express.Router();
const ReportRouter = require("./Report");
const DataRouter = require("./Data");
const AlertRouter = require("./Alert");

router.use(
  "/report",
  AuthManager.requiresScopes(["Users", "SYSTEM"]),
  ReportRouter
);

router.use(
  "/data",
  AuthManager.requiresScopes(["Users", "SYSTEM"]),
  DataRouter
);
router.use(
  "/alert",
  AuthManager.requiresScopes(["Users", "SYSTEM"]),
  AlertRouter
);
module.exports = router;
