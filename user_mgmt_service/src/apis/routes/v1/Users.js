const express = require('express');

const { HttpResponseHandler, Logger:log} = require('sarvm-utility');
const { UsersController } = require('@controllers/v1');
const AddressRouter = require('./Address');
const router = express.Router();

const { requestHandler } = require('@common/utility');

// Todo: Validation middleware needs to be included

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
    log.error({error:error});
    next(error);
  }
};

router.get('/', handleRESTReq(UsersController.getUsers));


router.post('/createUser', handleRESTReq(UsersController.createUser));

router.post('/', handleRESTReq(UsersController.getUsersById));


router.get('/upload', handleRESTReq(UsersController.uploadFile));


router.get('/QRcodeImage', handleRESTReq(UsersController.qrCodeImageURL));


router.get('/:userId', handleRESTReq(UsersController.getUserById));


router.delete('/:userId', handleRESTReq(UsersController.deleteUser));


router.put('/:userId', handleRESTReq(UsersController.updateUser));


router.patch('/:userId/profile', handleRESTReq(UsersController.updateUserProfile));


router.use('/:userId/address', AddressRouter);

module.exports = router;
