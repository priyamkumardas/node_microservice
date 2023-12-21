const express = require('express');
const { HttpResponseHandler, Logger } = require('sarvm-utility');
const OrganizationController = require('@controllers/v1/Organization');

const router = express.Router();

const { requestHandler } = require('@common/utility');

const handleRequest = async (validationSchema, fn, dataValues) => {
  // validate dataValues with validation Schema
  const data = await fn(dataValues);
  return data;
};

const handleRESTReq = (fn, validationSchema) => async (req, res, next) => {
  try {
    const restHeader = req.headers;
    const restBody = req.body;
    const restParams = req.params;
    const restQuery = req.query;
    // const restPath = req.path;
    const user = req.authPayload;
    const dataValues = {
      user,
      ...restHeader,
      ...restParams,
      ...restBody,
      ...restQuery,
    };
    const data = await handleRequest(validationSchema, fn, dataValues);
    HttpResponseHandler.success(req, res, data);
  } catch (error) {
    Logger.info(error);
    next(error);
  }
};


router.get('/', handleRESTReq(OrganizationController.getOrganizations));

router.get('/:id/employees', handleRESTReq(OrganizationController.getOrganizationEmployees));

router.post('/', handleRESTReq(OrganizationController.createOrganization));

router.get('/:id', handleRESTReq(OrganizationController.getOrganization));

router.put('/:id', handleRESTReq(OrganizationController.updateOrganization));

router.delete('/:id', handleRESTReq(OrganizationController.deleteOrganization));

module.exports = router;
