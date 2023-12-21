const catalog = {
  type: 'object',
  properties: {
    products: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number' },
          name: { type: 'string' },
          image: { type: 'string' },
          soldBy: { type: 'string' },
          quantity: { type: 'number' },
          regularPrice: { type: 'number' },
          discountPrice: { type: 'number' },
          placeOrigin: { type: 'string' },
          description: { type: 'string' },
          selected: { type: 'boolean' },
        },
        required: ['id'],
        additionalProperties: true,
      },
    },
  },
  required: ['products'],
  additionalProperties: true,
};

module.exports = {
  catalog,
};
