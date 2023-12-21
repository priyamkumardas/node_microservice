const createUser = {
  type: 'object',
  properties: {
    basicInformation: {
      type: 'object',
      additionalProperties: true,
    },
    retailerData: {
      type: 'object',
      additionalProperties: true,
    },
    deliveryData: {
      type: 'object',
      additionalProperties: true,
    },
    householdData: {
      type: 'object',
      additionalProperties: true,
    },
  },
  additionalProperties: true,
};

module.exports = { createUser };
