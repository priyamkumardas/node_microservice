const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const AddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: 'User',
    },

    addressType: {
      type: 'String',
    },
    primary: {
      type: 'Boolean',
      default: false,
    },
    streetAddress: {
      type: 'String',
    },
    locality: {
      type: 'String',
    },
    landmark: {
      type: 'String',
    },
    region: {
      type: 'String',
    },
    city: {
      type: 'String',
    },
    state: {
      type: 'String',
    },
    country: {
      type: 'String',
      default: 'India',
    },
    pincode: {
      type: 'String',
    },
    location: {
      longitude: {
        type: 'String',
      },
      latitude: {
        type: 'String',
      },
    },
    isDeleted: {
      type: 'Boolean',
      defalut: false,
    },
    createdBy: {
      type: 'String',
      defalut: null,
    },
    updatedBy: {
      type: 'String',
      defalut: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true }, versionKey: false },
);
const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;
