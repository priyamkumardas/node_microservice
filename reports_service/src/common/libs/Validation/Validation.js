const HttpResponseHandler = require("../HttpResponseHandler");
const { ValidationError } = require("express-json-validator-middleware");
const { Validator } = require("express-json-validator-middleware");
const { validate } = new Validator();

function validationErrorMiddleware(error, request, response, next) {
  if (response.headersSent) {
    return next(error);
  }
  const isValidationError = error instanceof ValidationError;
  if (!isValidationError) {
    return next(error);
  }
  HttpResponseHandler.error(request, response, error.validationErrors, 422);
}
module.exports = { validationErrorMiddleware, validate };
