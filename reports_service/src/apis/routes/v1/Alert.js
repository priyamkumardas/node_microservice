const express = require("express");

const { HttpResponseHandler, Logger: log } = require("sarvm-utility");
const { AlertController } = require("@controllers/v1");
const router = express.Router();

router.get("/subscription/:userId", async (req, res, next) => {
  log.info({info: 'Inside get Subscription userId'})
  //Done
  try {
    const { userId } = req.params;
    
    const data = await AlertController.alertSubscription(userId);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
