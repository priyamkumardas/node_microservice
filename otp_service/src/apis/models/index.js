/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');
const config = require('@config');

const OtpSchema = new mongoose.Schema(
  {
    userid: String,
    otp: String,
    retryCount: { type: Number, default: 1 },
    createdAt: { type: Date, expireAfterSeconds: 600, default: Date.now },
  },
  { collection: config.db.connection.collection },
);
OtpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

OtpSchema.pre('findOneAndUpdate', (next) => {
  next();
});

const Otp = mongoose.model(config.db.connection.collection, OtpSchema);

module.exports = Otp;
