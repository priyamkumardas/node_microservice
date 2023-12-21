const FavouriteValidateSchema = {
  required: ['userId', 'shopId'],
  properties: {
    userId: {
      $id: '#/properties/userId',
      type: 'string',
      isNotEmpty: false,
    },
    shopId: {
      $id: '#/properties/shopId',
      type: 'string',
      isNotEmpty: false,
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

const addFavouriteValidationSchema = {
  ...FavouriteValidateSchema,
  properties: { ...FavouriteValidateSchema.properties, ...GetAllValidateSchema.properties },
  required: [...FavouriteValidateSchema.required],
  $id: 'http://example.org/root.json#AddFavourite',
};

const updateFavouriteSchema = {
  ...FavouriteValidateSchema,
  properties: { ...FavouriteValidateSchema.properties, ...GetAllValidateSchema.properties },
  required: [],
  $id: 'http://example.org/root.json#UpdateFavourite',
};

module.exports = {
  FavouriteValidateSchema,
  GetAllValidateSchema,
  GetValidateSchema,
  addFavouriteValidationSchema,
  updateFavouriteSchema,
};
