const express = require('express');

const {
  node: { buildNumber, serviceName },
} = require('@config');

const { HttpResponseHandler, Logger: log } = require('sarvm-utility');

const v1Routes = require('./v1');
const router = express.Router();

// Health Check
router.get('/healthcheck', (req, res) => {
  log.info({ info: 'inside health check' });
  const data = {
    ts: new Date(),
    buildNumber,
    serviceName,
  };
  return HttpResponseHandler.success(req, res, data);
});

router.use('/v1', v1Routes);

router.use('*', (req, res) => {
  return HttpResponseHandler.success(req, res, 'Invalid Request');
});

module.exports = router;
