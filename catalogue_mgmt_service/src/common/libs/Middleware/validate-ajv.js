const { VALIDATION_ERROR } = require('@root/src/apis/errors/CommonError');
const ajvInstance = require('../Validation/ajv-instance');

const validateAjv = (schema, args) => {
  try {
    const ajvValidate = ajvInstance.compile(schema);
    let valid = true;

    valid = ajvValidate(args);

    if (!valid) {
      const { errors } = ajvValidate;
      throw new VALIDATION_ERROR(JSON.stringify(errors));
    }
  } catch (e) {
    throw new VALIDATION_ERROR(e);
  }
};

module.exports = { validateAjv };
