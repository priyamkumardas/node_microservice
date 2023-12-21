const express = require('express');

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('../../openapi/openapi.json');
// const timeZoneHandler = require('@common/timeZoneHandler');
const {
  node: { buildNumber },
} = require('@config');
const HttpResponseHandler = require('@common/libs/HttpResponseHandler');
const { Logger } = require('sarvm-utility');
const v1Routes = require('./v1');

const router = express.Router();

// Health Check
router.get('/healthcheck', (req, res) => {
  Logger.info({info: 'inside healthcheck '});
  const data = {
    ts: new Date(),
    buildNumber,
  };
  return HttpResponseHandler.success(req, res, data);
});

router.use('/apidocs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

router.use('/v1', v1Routes);

module.exports = router;
