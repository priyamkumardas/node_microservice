const mongoose = require("mongoose");

const holdRewardSchema = mongoose.Schema(
  {
    refId: {
      type: String,
      required: true,
    },
    referType: {
      type: String,
      required: true,
    },
    isReferrer: {
      type: Boolean,
      required: true,
    },
    eventName: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
    },
    retailerId: {
      type: String,
      required: true,
    },
    userDetails: new mongoose.Schema({
      phoneNumber: {
        type: String,
        required: true,
      },
      userId: {
        type: String,
        required: true,
      },
      userType: {
        type: String,
        required: true,
      },
      segmentId: {
        type: String,
        required: true,
      },
      flyyUserId: {
        type: String,
        required: true,
      },
    }),
  },
  { timestamps: true }
);

const HoldReward = mongoose.model("HoldRewards", holdRewardSchema);

module.exports = {
  HoldReward,
};
