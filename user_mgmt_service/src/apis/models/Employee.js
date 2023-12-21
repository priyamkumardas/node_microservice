const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    managerId: {
      type: String,
      // required: true,
    },
    org_id: {
      type: String,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    dateofJoining: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      // required: true,
    },
    profilePhotoURL: {
      type: String,
      default: null,
      // required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pincode: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    organization: {
      type: String,
      enum: ['sarvm', 'other'],
      default: 'sarvm'
    },
    approved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true },
);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
