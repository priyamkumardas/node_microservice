const { ADMIN } = require('@common/utility/constants');

const isAdmin = (status, role, whichAdminRoleType) => {
  if (status !== ADMIN.STATUS.ACTIVE) {
    return false;
  }
  if (whichAdminRoleType === ADMIN.ROLE.ADMIN) {
    return role === ADMIN.ROLE.ADMIN || role === ADMIN.ROLE.SUPER_ADMIN;
  }
  // else if (whichAdminRoleType === ADMIN.ROLE.ADMIN) {
  return role === ADMIN.ROLE.SUPER_ADMIN;
};

module.exports = { isAdmin };
