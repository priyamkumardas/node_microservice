const express = require('express');
const { HttpResponseHandler, Logger } = require('sarvm-utility');
const { EmployeeController, UsersController } = require('@controllers/v1');
const { validateDto } = require('@common/libs/middleware');
const { Employee, UpdateEmployeeStatus, UpdateEmployee } = require('@common/libs/Validation');
const { on } = require('../../models/Employee');

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

router.get('/allEmp', handleRESTReq(EmployeeController.getAllEmployees));

router.get('/getTotalEntity', handleRESTReq(EmployeeController.getAllEntity))

router.get('/', handleRESTReq(EmployeeController.getEmpTree));

router.get('/upload', handleRESTReq(EmployeeController.uploadFile));

router.post('/', handleRESTReq(EmployeeController.createEmployee));

router.get('/:id', handleRESTReq(EmployeeController.getEmployee));

router.delete('/:id', handleRESTReq(EmployeeController.deleteEmployee));

router.put('/:employeeId', handleRESTReq(EmployeeController.editEmployee));

router.put('/status/:employeeId', handleRESTReq(EmployeeController.editEmployee));

module.exports = router;
