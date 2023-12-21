const express = require('express');

// const timeZoneHandler = require('@common/timeZoneHandler');
const {
  node: { buildNumber, serviceName },
} = require('@config');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('@src/apis/openapi/openapi.json');
// const { packageVersion } = require('@config');
const { HttpResponseHandler, Logger:log } = require('sarvm-utility');

const v1Routes = require('./v1');

const router = express.Router();

// Health Check
router.get('/healthcheck', (req, res) => {
  log.info({info:'inside healthCheck '})
  const data = {
    ts: new Date(),
    buildNumber,
    serviceName,
  };
  return HttpResponseHandler.success(req, res, data);
});

// router.get('/utc', (req, res) => {
//  return HttpResponseHandler.success(req, res, timeZoneHandler.getCurrentUTCMoment.toISOString());
// });

router.use('/v1', v1Routes);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));
module.exports = router;
