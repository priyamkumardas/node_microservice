const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  refreshTokenTimestamp: {
    type: Number,
    required: true,
    default: Math.round(new Date().getTime() / 1000),
  },

  basicInformation: {
    // type: {
    personalDetails: {
      // type: {
      firstName: String,
      lastName: String,
      FathersName: String,
      DOB: Date,
      Gender: String,
      secondaryMobileNumber: String,
      emailID: String,
      // },
      // required: false,
    },
    kycDetails: {
      kycId: String,
    },
    transactionDetails: {
      transactionDetailsId: String,
    },
  },
  // },

  retailerData: {
    // type: {
    // retailerId: {
    //   type: String,
    // },
    // },
    // required: false,
  },
  deliveryData: {
    // type: {
    // deliveryId: {
    //   type: String,
    // },
    // },
    // required: false,
  },
  householdData: {
    // type: {
    // householdId: {
    //   type: String,
    // },
    // addresses: {
    //   Home: {
    //     type: String,
    //   },
    //   Office: {
    //     type: String,
    //   },
    // },
    // },
    // required: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
