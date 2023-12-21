const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema(
  {
    ref_by: {
      type: String,
      required: true,
    },
    refByPhone: {
      type: String,
      required: true,
    },
    refByUserType: {
      type: String,
      required: true,
    },
    refByFlyyUserId: {
      type: String,
      required: true,
    },
    refBySegmentId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    reminder_count: {
      type: Number,
      default: 0,
    },
    ref_status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED"],
      required: true,
    },
    campaign: {
      type: Object,
    },
    ratings: {
      type: Number,
      default: 5
    },
    comments: [{
      type: String,
      default: null
    }],
    location: {
      latitude: {
        type: String,
      //  required: true, 
      //removing required as per Ritik Suggestion
      },
      longitude: {
        type: String,
      //  required: true,
      //removing required as per Ritik Suggestion
      }
    }
  },
  { timestamps: true }
);

const Referral = mongoose.model("Referrals", referralSchema);

module.exports = {
  Referral,
};
