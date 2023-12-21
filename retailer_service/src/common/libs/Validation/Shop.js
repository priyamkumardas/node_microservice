const number = {
  type: ['string', 'integer'],
  pattern: '^[1-9][0-9]*$',
  minimum: 1,
};

const addShop = {
  type: 'object',
  properties: {
    longitude: { type: 'number' },
    latitude: { type: 'number' },
    shop_number: { type: 'string' },
    locality: { type: 'string' },
    landmark: { type: 'string' },
    street: { type: 'string' },
    // region: { type: 'string' },
    city: { type: 'string' },
    // state: { type: 'string' },
    pincode: number,
    shop_name: { type: 'string' },
    selling_type: { type: 'string' },
    veg: { type: 'string' },
    delivery: { type: 'string' },
    image: { type: 'string' },
    type_of_retailer: { type: 'string' },
    GST_no: { type: 'string' },
    isSubscribed: { type: 'boolean' },
    isKYCVerified: { type: 'boolean' },
  },
  required: [
    'longitude',
    'latitude',
    'shop_number',
    'locality',
    'landmark',
    'street',
    'city',
    'pincode',
    'shop_name',
    'selling_type',
  ],
  // additionalProperties: false,
};

const subscription = {
  type: 'object',
  properties: { isSubscribed: { type: 'boolean' } },
  required: ['isSubscribed'],
  additionalProperties: false,
};

const kycStatus = {
  type: 'object',
  properties: { isKYCVerified: { type: 'boolean' } },
  required: ['isKYCVerified'],
  additionalProperties: false,
};
const gstNo = {
  type: 'object',
  properties: { GST_no: { type: 'string' } },
  required: ['GST_no'],
  additionalProperties: false,
};
const shopViaUserId = {
  type: 'object',
  properties: {
    userId: { type: 'string' },
  },
  required: ['userId'],
  additionalProperties: false,
};
module.exports = {
  addShop,
  subscription,
  kycStatus,
  gstNo,
  shopViaUserId,
};
