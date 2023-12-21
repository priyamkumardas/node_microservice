const AddressValidateSchema = {
  required: [
    'addressType',
    'primary',
    'streetAddress',
    'locality',
    'landmark',
    'region',
    'city',
    'state',
    'country',
    'pincode',
    'location',
  ],
  properties: {
    addressType: {
      $id: '#/properties/addressType',
      type: 'string',
      isNotEmpty: false,
    },
    primary: {
      $id: '#/properties/primary',
      type: 'boolean',
    },
    streetAddress: {
      $id: '#/properties/streetAddress',
      type: 'string',
      isNotEmpty: false,
    },
    locality: {
      $id: '#/properties/locality',
      type: 'string',
      isNotEmpty: false,
    },
    landmark: {
      $id: '#/properties/landmark',
      type: 'string',
      isNotEmpty: false,
    },
    region: {
      $id: '#/properties/region',
      type: 'string',
      isNotEmpty: false,
    },
    city: {
      $id: '#/properties/city',
      type: 'string',
      isNotEmpty: false,
    },
    state: {
      $id: '#/properties/state',
      type: 'string',
    },
    country: {
      $id: '#/properties/country',
      type: 'string',
      isNotEmpty: false,
    },
    pincode: {
      $id: '#/properties/pincode',
      type: 'string',
      isNotEmpty: false,
    },
    location: {
      required: ['longitude', 'latitude'],
      properties: {
        longitude: {
          $id: '#/properties/location/properties/longitude',
          type: 'string',
        },
        latitude: {
          $id: '#/properties/location/properties/latitude',
          type: 'string',
        },
      },
      $id: '#/properties/location',
      type: 'object',
    },
  },
  $id: 'http://example.org/root.json#',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
};
const GetAllValidateSchema = {
  required: ['userId'],
  properties: {
    userId: {
      $id: '#/properties/userId',
      type: 'string',
      isNotEmpty: true,
    },
  },
  $id: 'http://example.org/root.json#',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
};
const GetValidateSchema = {
  required: ['userId', 'id'],
  properties: {
    userId: {
      $id: '#/properties/userId',
      type: 'string',
      isNotEmpty: true,
    },
    id: {
      $id: '#/properties/id',
      type: 'string',
      isNotEmpty: true,
    },
  },
  $id: 'http://example.org/root.json#',
  type: 'object',
  definitions: {},
  $schema: 'http://json-schema.org/draft-07/schema#',
};

const addAddressValidationSchema = {
  ...AddressValidateSchema,
  properties: { ...AddressValidateSchema.properties, ...GetAllValidateSchema.properties },
  required: [...AddressValidateSchema.required, ...GetAllValidateSchema.required],
  $id: 'http://example.org/root.json#AddAddress'
};

const updateAddressSchema = {
  ...AddressValidateSchema,
  properties: { ...AddressValidateSchema.properties, ...GetAllValidateSchema.properties },
  required: [],
  $id: 'http://example.org/root.json#UpdateAddress'
}

module.exports = {
  AddressValidateSchema,
  GetAllValidateSchema,
  GetValidateSchema,
  addAddressValidationSchema,
  updateAddressSchema
};
