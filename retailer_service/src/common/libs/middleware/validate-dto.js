const { VALIDATION_ERROR } = require('@root/src/apis/errors');
const ajvInstance = require('../Validation/ajv-instance');

function validateDto(schema, type) {
  return (req, res, next) => {
    try {
      const ajvValidate = ajvInstance.compile(schema);
      let valid = true;
      if (type === 'body') {
        valid = ajvValidate(req.body);
      } else if (type === 'query') {
        valid = ajvValidate(req.query);
      } else {
        valid = ajvValidate(req.body);
      }
      if (!valid) {
        const { errors } = ajvValidate;
        res.status(400).json(errors);
      }
    } catch (e) {
      throw new VALIDATION_ERROR(e);
    }
    next();
  };
}

module.exports = validateDto;
