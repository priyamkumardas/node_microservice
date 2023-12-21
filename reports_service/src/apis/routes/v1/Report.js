const express = require('express');
const { Logger } = require('sarvm-utility');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');
const { ReportsController, ReferralsController } = require('@controllers/v1');
const { ReportService } = require('../../services/v1');
const { STATES } = require('mongoose');
const router = express.Router();

router.get('/catalog', async (req, res, next) => {
  log.info({ info: 'Inside get catalog' });
  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsController.generateReportCatalog(startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/transaction', async (req, res, next) => {
  log.info({ info: 'Inside get transaction' });
  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsController.generateReportTxn(startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/subscription', async (req, res, next) => {
  log.info({ info: 'Inside get subscription' });
  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsController.generateReportSubscription(startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/salesacquisition', async (req, res, next) => {
  log.info({ info: 'Inside get sales acquisition' });

  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsController.generateReportEmployee(startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/salesreport', async (req, res, next) => {
  log.info({ info: 'Inside get sales report' });
  //Done
  try {
    const { startDate, endDate } = req.query;
    const data = await ReportsController.generateReport(startDate, endDate);
    res.send(data);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/salesreport1', async (req, res, next) => {
  log.info({ info: 'Inside get sales report1' });
  //Done
  try {
    // const { startDate, endDate } = req.query;
    const data = await ReportsController.getphone();
    res.send(data);
    //HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});
router.get('/order-aggregation-report/:shopId', async (req, res, next) => {
  log.info({ info: 'Inside get order aggregation shop Idtion report' });
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;
    const data = await ReportsController.getOrderAggregationReport(shopId, startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    next(error);
  }
});

router.get('/top-customer-report/:shopId', async (req, res, next) => {
  log.info({ info: 'Inside get top customer report shopId' });
  try {
    const { shopId } = req.params;
    const { startDate, endDate } = req.query;
    const data = await ReportsController.getTopCustomerReport(shopId, startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    Logger.error(error);
  }
});

router.get('/user-detailed-orders/:shopId/:userId', async (req, res, next) => {
  log.info({ info: 'Inside get user detailed orders shopId userId' });

  try {
    const { shopId, userId } = req.params;
    const { startDate, endDate } = req.query;
    const data = await ReportsController.getUserDetailedOrders(shopId, userId, startDate, endDate);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    Logger.error(error);
  }
});

module.exports = router;
