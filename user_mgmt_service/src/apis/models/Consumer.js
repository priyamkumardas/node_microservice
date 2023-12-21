const mongoose = require('mongoose');
const ConsumerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: 'User',
    },
    guid: {
      type: String,
      unique: true,
      required: true,
    },
    s3URL: {
      type: 'String',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true }, versionKey: false },
);
const Consumer = mongoose.model('Consumer', ConsumerSchema);

module.exports = Consumer;
