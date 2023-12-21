const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const FavouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    shopId: {
      type: 'String',
      
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
const Favourite = mongoose.model('Favourite', FavouriteSchema);

module.exports = Favourite;
