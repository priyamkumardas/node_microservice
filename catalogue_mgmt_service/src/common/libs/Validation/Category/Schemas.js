const pattern = {
  type: ['string', 'integer'],
  pattern: '^*(.)(jpg|png\bmp)',
  minimum: 1,
};
const decimalNumber = {
  type: 'number',
  multipleOf: 0.01,
};

const createCategoryschema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string' },
    parent_id: { type: 'string' },
    catalog_id: { type: 'string' },
  },
  required: ['name', 'image'],
  // additionalProperties: true,
};

const update_category = createCategoryschema;

module.exports = { createCategoryschema, update_category };
