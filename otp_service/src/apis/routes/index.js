const express = require('express');

// const timeZoneHandler = require('@common/timeZoneHandler');
const {
  node: { buildNumber, serviceName },
} = require('@config');
const { HttpResponseHandler } = require('sarvm-utility');

const v1Routes = require('./v1');

const router = express.Router();

router.get('/healthcheck', (req, res) => {
  const data = {
    ts: new Date(),
    buildNumber,
    serviceName,
  };
  return HttpResponseHandler.success(req, res, data);
});

router.use('/v1', v1Routes);

module.exports = router;
