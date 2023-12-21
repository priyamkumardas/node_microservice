const productCategory = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    category_mapping_id: { type: 'string' },
    catalog_id: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string' },
  },
  required: ['id', 'category_mapping_id', 'catalog_id'],
};

module.exports = { productCategory };
