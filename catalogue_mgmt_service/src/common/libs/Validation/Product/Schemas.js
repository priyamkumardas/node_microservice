const pattern = {
  type: ['string', 'integer'],
  pattern: '^*(.)(jpg|png\bmp)',
  minimum: 1,
};
const decimalNumber = {
  type: 'number',
  multipleOf: 0.01,
};

const create_product = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    description: { type: 'string' },
    icon: { type: 'string' },
    image: { type: 'string' },
    hsn: { type: 'string' },
    veg: {
      type: 'string',
      enum: ['Veg', 'Non-Veg', 'Jain', 'Egg', 'Not Applicable'],
    },
    min_oq: { type: 'string' },
    tax: decimalNumber,
    min_price: decimalNumber,
    max_price: decimalNumber,
    sp: decimalNumber,
    mrp: decimalNumber,
    max_oq: decimalNumber,
    min_ppo: decimalNumber,
    weight_per_piece: decimalNumber,
    rp: decimalNumber,
    metadata: { type: 'object' },
    moq: { type: 'string' },
    tax_status: { type: 'string' },
  },
  required: ['name', 'description', 'image', 'veg', 'min_oq', 'tax_status'],
  // additionalProperties: false,
};

const update_product = create_product;

module.exports = { create_product, update_product };
