/* eslint-disable no-param-reassign */
const {
  // eslint-disable-next-line no-unused-vars
  ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require('sarvm-utility');
const { EmployeeService, UsersService, OrganizationService } = require('@services/v1');
const { ErrorHandler } = require('@common/libs');
const RetailerService = require('@services/v1/Retailer');
const { getOrganization } = require('./Organization');
const axios = require('axios');
const { loadBalancer } = require("@root/src/config");

// eslint-disable-next-line max-len, no-unused-vars
const {
  MANAGER_DOES_NOT_EXISTS_ERROR,
  YOU_CANT_CREATE_EMPLOYEE,
  EMPLOYEE_ALREADY_EXIST,
  EMPLOYEE_NOT_HAVE_ORGANIZATION,
  INVALID_MANAGER
} = ErrorHandler;
const getprofilePhotoURL = (employee) => {
  if ('profilePhotoURL' in employee) {
    if (!employee.profilePhotoURL) return null;
    const URL = employee.profilePhotoURL.split('?');
    return URL[0];
  }
  return null;
};

const uploadFile = async () => EmployeeService.uploadFile();

const getAllEmployees = async (req) => EmployeeService.getAllEmployees(req);

const getAllEntity = async(req) =>{
  try {

    const RMS_GET_SHOP_COUNT = loadBalancer + "/rms/apis/v1/shop/shopCount";
    const employees = await EmployeeService.getEmployeeCount()
    const retialers = await UsersService.getRetailerCount()
   
    const result = await axios.get(RMS_GET_SHOP_COUNT)
    const shops = result.data
   
    return {employees, retialers, shops : shops.data};

  } catch (err) {
    throw err;
  }

}

const getEmpTree = async (args) => {
  log.info({info:'Employee Tree Controller :: inside get Employee Tree'});
  try {
    const { user, onlyManagers, app_name } = args;
    const { phone } = user;
    const hasAdminAccess = await UsersService.isCallFromAdminApp(user, app_name);
    return await EmployeeService.getEmpTree({ phone, onlyManagers }, hasAdminAccess);
  } catch (error) {
    throw error;
  }
};

const getEmployee = async (args) => {
  log.info({info:'Employee Tree Controller :: inside get Employee '});
  const { id } = args;
  const params = {};
  if (id.length === 10) {
    params.mobileNumber = id;
  } else {
    params.employeeId = id;
  }
  let result = await EmployeeService.getEmployee(params);
  let org = await getOrganization({ id: result.org_id });
  result.organization = org?.name;
  return result;
};

const getOrganizationById = async ({ userId }) => {
  log.info({info:'Employee Controller :: inside get organization by id'});
  let filter = { userId: userId };

  const { org_id } = await EmployeeService.getEmployeeByUserId(filter);

  if (org_id === undefined) throw new EMPLOYEE_NOT_HAVE_ORGANIZATION();

  const { name } = await OrganizationService.getOrganization(org_id);

  return name === 'sarvm' ? { status: true, managerOrgId: org_id } : { status: false, managerOrgId: org_id };
};

const checkManagerOrganization = async (managerId, userOrgId) => {
  log.info({info:'Employee  Controller :: inside check Manager organization'});
  const { name } = await OrganizationService.getOrganization(userOrgId);
  const { org_id, isActive, status, role } = await EmployeeService.getEmployeeByUserId({ employeeId: managerId });
  // validation for checking manager is either SH or CO and is in deactivate stage.
  if ((!isActive || !status) && (role === 'CO' || role === 'SH')) return false
  if (name === "sarvm") {
    const managersOrg = await OrganizationService.getOrganization(org_id);
    let managersOrgName = managersOrg.name;
    if (managersOrgName !== "sarvm") return false
  }
  return true
}

const createEmployee = async (args) => {
  log.info({info:'Employee Controller :: inside create Employee Tree'});
  const { user, managerId, mobileNumber, role, fullName, dateofJoining, profilePhotoURL, pincode, org_id, email } =
    args;
  const employee = { managerId, mobileNumber, role, fullName, dateofJoining, profilePhotoURL, pincode, org_id, email };

  const { status, managerOrgId } = await getOrganizationById(user, role, managerId);
  if (!status && org_id !== managerOrgId) {
    throw new YOU_CANT_CREATE_EMPLOYEE();
  }

  // validation for checking manager belongs from which organization
  let isSarvmManager = await checkManagerOrganization(managerId, org_id);
  if (!isSarvmManager) {
    throw new INVALID_MANAGER()
  }

  if (user.userType === 'EMPLOYEE_SSO') {
    throw new INTERNAL_SERVER_ERROR(error);
  }

  user.userType === 'EMPLOYEE_CO'
    ? ((employee.status = false), (employee.approved = false))
    : ((employee.status = true), (employee.approved = true));
  const employeeDocument = await EmployeeService.getEmployee({ mobileNumber: mobileNumber });
  if (employeeDocument) {
    throw new EMPLOYEE_ALREADY_EXIST();
  }

  // const allEmployeeCount = await EmployeeService.countEmployee();
  let lastEmployeeId = await EmployeeService.getLastEmployeeId()
  lastEmployeeId = parseInt(lastEmployeeId.split("-")[1])
  // validation
  // const { managerId, fullName } = employee;
  if (managerId) {
    const managerDocument = await EmployeeService.getEmployee({ employeeId: managerId });
    if (managerDocument === null || typeof managerDocument === 'undefined') {
      throw new MANAGER_DOES_NOT_EXISTS_ERROR();
    }
  }

  // profilePhoto format update
  employee.profilePhotoURL = getprofilePhotoURL(employee);

  // generate unique employeeID
  const newEmployeeId = `000000${parseInt(lastEmployeeId, 10) + 1}`.slice(-6);
  employee.employeeId = `S-${newEmployeeId}`;
  const data = await EmployeeService.createEmployee(employee);
  const empUserId = employee.userId.toString();
  RetailerService.updateDummySubscription(empUserId);
  return data;
};

const editEmployee = async (args) => {
  log.info({info:'Employee  Controller :: inside edit Employee '});
  const {
    employeeId,
    status,
    managerId,
    mobileNumber,
    role,
    fullName,
    dateofJoining,
    email,
    pincode,
    org_id,
    userId,
    profilePhotoURL,
  } = args;
  const newValues = {
    status,
    managerId,
    mobileNumber,
    role,
    fullName,
    dateofJoining,
    email,
    pincode,
    org_id,
    userId,
    profilePhotoURL,
  };

  const params = {
    employeeId,
    newValues,
  };

  return await EmployeeService.editEmployee(params);
};

const deleteEmployee = async ({ id }) => {
  // const params = {};
  // if (id.length === 10) {
  //   params.mobileNumber = id;
  // } else {
  //   params.employeeId = id;
  // }
  // return EmployeeService.deleteEmployee(params);
  return { msg: 'Delete functionality is not supported as of now' };
};

module.exports = {
  uploadFile,
  getAllEmployees,
  getEmpTree,
  getAllEntity,
  getEmployee,
  createEmployee,
  editEmployee,
  deleteEmployee,
};
