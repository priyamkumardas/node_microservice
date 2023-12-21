// const express = require("express");

// const { HttpResponseHandler } = require("sarvm-utility");
// const { ReportsController, ReferralsController } = require("@controllers/v1");
// const router = express.Router();

// router.get("/catalog", async (req, res, next) => {
//   //Done
//   try {
//     const data = await ReportsController.generateReportCatalog();
//     HttpResponseHandler.success(req, res, data);
//   } catch (error) {
//     next(error);
//   }
// });

// router.get("/employee", async (req, res, next) => {
//   try {
//     const { authPayload: user } = req;
//     const body = req.body;
//     const { startDate, endDate } = body;
//     const data = await ReferralsController.generateReport(startDate, endDate);
//     HttpResponseHandler.success(req, res, data);
//   } catch (error) {
//     next(error);
//   }
// });
// router.get("/transaction", async (req, res, next) => {
//   //Done
//   try {
//     const data = await ReportsController.generateReportTxn();
//     HttpResponseHandler.success(req, res, data);
//   } catch (error) {
//     next(error);
//   }
// });
// router.get("/subscription", async (req, res, next) => {
//   //Done
//   try {
//     const data = await ReportsController.generateReportSubscription();
//     HttpResponseHandler.success(req, res, data);
//   } catch (error) {
//     next(error);
//   }
// });
// router.post("/subscriptionFailed", async (req, res, next) => {
//   //Done
//   try {
//     const { userId, phone, amount } = req.body;
//     const data = await ReportsController.generateReportSubscriptionFailed(
//       userId,
//       phone,
//       amount
//     );
//     HttpResponseHandler.success(req, res, data);
//   } catch (error) {
//     next(error);
//   }
// });

// module.exports = router;
