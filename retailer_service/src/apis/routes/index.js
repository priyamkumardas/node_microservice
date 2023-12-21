/* eslint-disable import/no-unresolved */
const express = require('express');

const {
  node: { buildNumber, serviceName },
} = require('@config');

const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('@src/apis/openapi/openapi.json');

const { AuthManager, HttpResponseHandler, Logger: log } = require('sarvm-utility');

const v1Routes = require('./v1');
const v2Routes = require('./v2');

const router = express.Router();

// Health Check
router.get('/healthcheck', (req, res) => {
  log.info({ info: 'Health Check' });
  const data = {
    ts: new Date(),
    buildNumber,
    serviceName,
  };
  return HttpResponseHandler.success(req, res, data);
});

router.use('/v1', v1Routes);
router.use('/v2', v2Routes);

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

module.exports = router;
