const { HttpResponseHandler } = require('sarvm-utility');
const { SCHEMA_VALIDATION_ERROR } = require('../ErrorHandler');
const ajvInstance = require('../Validation/ajv-instance');

function validateDto(schema) {
  return (req, res, next) => {
    try {
      const ajvValidate = ajvInstance.compile(schema);
      const valid = ajvValidate(req.body);

      if (!valid) {
        const { errors } = ajvValidate;
        return HttpResponseHandler.error(req, res, errors, 400);
      }
    } catch (error) {
      return HttpResponseHandler.error(req, res, error, 400);
    }
    return next();
  };
}
function validateRequestInput(schema, args) {
  try {
    if (schema === null) {
      return true;
    }

    const ajvValidate = ajvInstance.compile(schema);
    let valid = false;
    valid = ajvValidate(args);
    if (!valid) {
      if (ajvValidate.errors[0].instancePath === "/phone") {
        throw new SCHEMA_VALIDATION_ERROR("please enter a valid mobile number")
      }
      throw new SCHEMA_VALIDATION_ERROR("please enter a valid OTP")
    }
    return valid;
  } catch (e) {
    throw new SCHEMA_VALIDATION_ERROR(e.message);
  }
};


module.exports = { validateDto, validateRequestInput };
