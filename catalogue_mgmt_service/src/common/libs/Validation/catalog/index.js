const addCatalogSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    image: { type: 'string' },
    region: { type: 'string' },
    isParent: { type: 'string' },
    category_id: { type: 'string' },
    parent_id: { type: 'string' },
    hsn: { type: 'string' },
    tax_status: { type: 'string' },
  },
  required: ['name', 'image'],
  additionalProperties: false,
  // additionalProperties: true,
};

module.exports = { addCatalogSchema };
