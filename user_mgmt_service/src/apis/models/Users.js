const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ADMIN } = require('@common/utility/constants');

const UserSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE'
    },
    // username: {
    //   type: String,
    //   required: true,
    // },
    phone: {
      type: String,
      required: true,
      // unique: true,
    },
    userType: {
      type: String,
      default: 'INDIVIDUAL',
    },
    flyyUserId: {
      type: String,
      required: true,
      default: () => uuidv4(),
    },

    basicInformation: {
      // type: {
      personalDetails: {
        // type: {
        firstName: String,
        lastName: String,
        fathersName: String,
        dob: Date,
        gender: String,
        secondaryMobileNumber: String,
        emailId: String,
        profileImage: String,
        aboutUs: String
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

    adminData: {
      status: {
        type: String,

        default: ADMIN.STATUS.INACTIVE,
      },
      role: {
        type: String,

        default: ADMIN.ROLE.NON_ADMIN,
      },
    },
    retailerData: {
      userName: {
        type: String,
        default: null,
      },
      address: {
        type: String,

        default: null,
      },
      isOtpVerified: {
        type: Boolean,
        default: false,
      },
      isProfileCompleted: {
        type: Boolean,

        default: false,
      },
      lastLogin: {
        type: Date,
      },
      payment: {
        type: Object,
        upiInfo: {
          type: Array,
          name: String,
          mobile: String,
          app: String,
          upi: String,
          qrImage: String,
          active: Boolean,
        },
        default: { "upiInfo": [] }
      }
    },
    deliveryData: {
      userName: {
        type: String,
        default: null,
      },
      address: {
        type: String,

        default: null,
      },
      isOtpVerified: {
        type: Boolean,

        default: false,
      },
      isProfileCompleted: {
        type: Boolean,

        default: false,
      },
      lastLogin: {
        type: Date,
      },
      // type: {
      // deliveryId: {
      //   type: String,
      // },
      // },
      // required: false,
    },
    householdData: {
      isVeg: {
        type: Boolean,
        default: null
      },
      userName: {
        type: String,

        default: null,
      },
      address: {
        type: String,

        default: null,
      },
      isOtpVerified: {
        type: Boolean,

        default: false,
      },
      isProfileCompleted: {
        type: Boolean,

        default: false,
      },
      lastLogin: {
        type: Date,
      },
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
    referralCode: {
      type: String,
      unique: true,
      default: () => {
        const prefix = 'SARVM-';
        const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
        return prefix.concat(Math.random().toString(36).substr(2, randomInteger(6, 10)));
      },
    },


  },
  { timestamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
