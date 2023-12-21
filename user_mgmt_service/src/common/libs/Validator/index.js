const ajvInstance = require('../Validation/ajv-instance');
ajvInstance.addKeyword({
  keyword: 'isNotEmpty',
  validate: (schema, data) => {
    if (schema) {
      return typeof data === 'string' && data.trim() !== '';
    } else return true;
  },
  error: {
    message: 'string field must be non-empty',
  },
});
async function validateRequest(schema, request) {
  const ajvValidate = await ajvInstance.compile(schema);
  const valid = await ajvValidate(request);
  const { errors } = ajvValidate;
  return { valid, errors };
}

module.exports = validateRequest;
