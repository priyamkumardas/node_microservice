const mongoose = require('mongoose');

const MasterCatalogSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      // required: true,
      // unique: true,
    },
    version: {
      type: Number,
      default: 1,
      // required: true,
      // unique: true,
    },
    url: {
      type: String,
    },

    active: {
      type: Boolean,
      // required: true,
      // unique: true,
    },
    created_by: {
      type: String,
      // required: true,
    },
    updated_by: {
      type: String,
      // required: true,
    },
    created_at: {
      type: Number,
      // required: true,
    },
    updated_at: {
      type: Number,
      // default: true,
      // required: true,
    },
  },
  { timestamps: true },
);

const MasterCatalog = mongoose.model('MasterCatalog', MasterCatalogSchema);

module.exports = MasterCatalog;
