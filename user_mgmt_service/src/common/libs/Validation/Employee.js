const {
  empRoles: { SH, CO, SSO },
} = require('@constants');

const Employee = {
  type: 'object',
  properties: {
    // managerId: {
    //   type: 'string',
    //   maxLength: 8,
    //   // minLength: 8,
    // },
    mobileNumber: {
      type: 'string',
    },
    role: {
      type: 'string',
      enum: [SH, CO, SSO],
    },
    fullName: {
      type: 'string',
      pattern: '^[a-zA-Z_ ().]*$',
    },
    dateofJoining: {
      type: 'string',
      pattern: '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$',
    },
    // profilePhotoURL: {
    //   type: 'string',
    // },
  },
  // required: ['managerId', 'mobileNumber', 'role', 'fullName', 'dateofJoining'],
  // additionalProperties: false,
};

const UpdateEmployee = {
  type: 'object',
  properties: {
    managerId: {
      type: 'string',
      maxLength: 8,
      minLength: 8,
    },
    mobileNumber: {
      type: 'string',
    },
    role: {
      type: 'string',
      enum: [SH, CO, SSO],
    },
    fullName: {
      type: 'string',
      pattern: '^[a-zA-Z_ ]*$',
    },
    dateofJoining: {
      type: 'string',
      pattern: '^([0]?[1-9]|[1|2][0-9]|[3][0|1])[./-]([0]?[1-9]|[1][0-2])[./-]([0-9]{4}|[0-9]{2})$',
    },
    // profilePhotoURL: {
    //   type: 'string',
    // },
  },
  // required: [],
  // additionalProperties: false,
};

const UpdateEmployeeStatus = {
  type: 'object',
  properties: {
    status: {
      type: 'boolean',
    },
  },
  required: ['status'],
  additionalProperties: false,
};

module.exports = {
  Employee,
  UpdateEmployeeStatus,
  UpdateEmployee,
};
