const express = require("express");
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('../../openapi/openapi.json');
// const timeZoneHandler = require('@common/timeZoneHandler');
const {
  node: { buildNumber, serviceName },
} = require("@config");
const HttpResponseHandler = require("@common/libs/HttpResponseHandler");
const { Logger:log } = require('sarvm-utility');


const v1Routes = require("./v1");

const router = express.Router();

// Health Check
router.get("/healthcheck", (req, res) => {
  log.info({info: 'inside healthcheck API'});
  const data = {
    ts: new Date(),
    buildNumber,
    serviceName,
  };
  return HttpResponseHandler.success(req, res, data);
});

router.use('/apidocs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

// router.get('/utc', (req, res) => {
//   return HttpResponseHandler.success(req, res, timeZoneHandler.getCurrentUTCMoment.toISOString());
// });

router.use("/v1", v1Routes);

module.exports = router;
