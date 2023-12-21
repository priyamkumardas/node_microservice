const {
  ErrorHandler: { INTERNAL_SERVER_ERROR }
} = require('sarvm-utility');
const db = require('@db');
const mongoose = require('mongoose');
const {
  ErrorHandler: { DUPLICATE_MOBILE_ERROR, MOBILE_CANT_UPDATE, DATA_BASE_ERROR, EMPLOYEE_DOES_NOT_EXIST },
} = require('@common/libs');
const { Logger: log } = require('sarvm-utility');
const { Employee, Users } = require('@root/src/apis/models');
const { createKey } = require('./createUniqueIdNUmber');
const { amazonPresignedUrl } = require('./UploadDocuments');
const UsersService = require('./Users');

const uploadFile = async () => {
  log.info({info: 'Upload service :: inside upload file'})
  try {
    const passbookPhotoUniqueKey = createKey('ems', 'profile_photo');
    const profilePhoto = await amazonPresignedUrl(passbookPhotoUniqueKey);
    return profilePhoto;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

const getEmployeeCount = async() => {
  try {
    const totalEmployee = await Employee.countDocuments({ isActive: true });
    return totalEmployee
  } catch(err) {
    throw new DATA_BASE_ERROR('Error in getting employees from DB');
  }
}

const getAllEmployees = async (req = {}) => {
  log.info({info:'Employee service :: inside get all employee'});
  try {
    const pageSize = req?.pageSize || null
    const currentPage = req?.page || 1; 
    const {q} = req

    var result
    var query
    var totalCount

    if (q) {
       query = { isActive: true ,
        $or: [
          { employeeId: { $regex: new RegExp(q, 'i') } },
          { fullName: { $regex: new RegExp(q, 'i') } }, 
          { role: { $regex: new RegExp(q, 'i') } },
          { mobileNumber: { $regex: new RegExp(q, 'i') } }
        ]}
    } else {
      query = { isActive: true }
    }

    totalCount = await Employee.countDocuments({ isActive: true })

    if (pageSize) {
      const skipCount = (currentPage - 1) * pageSize;
      result = await Employee.find(query).skip(skipCount).limit(Number(pageSize));
    } else {
      result = await Employee.find(query);
    }
    return {result,totalCount};
  } catch (err) {
    throw new DATA_BASE_ERROR('Error in getting employees from DB');
  }
};

const getEmployee = async (params) => {
  try {
    // const { Employees } = db.getInstance();
    const result = await Employee.findOne(params);
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error in getting employee from DB');
  }
};

const getEmployeeByUserId = async (params) => {
  try {
    const result = await Employee.findOne(params);
    return result;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error in getting employee from DB');
  }
};

const insertToEmployee = async (employeeObj, session) => {
  try {
    // const { Employees } = db.getInstance();
    const opts = { session };
    const employee = await Employee(employeeObj).save(opts);
    return employee;
  } catch (err) {
    throw new DATA_BASE_ERROR(err);
  }
};

const updateUserFromEmployee = async (mobileNumber, role, session) => {
  try {
    const conditions = { phone: mobileNumber };
    const options = {
      upsert: true,
      new: true,
      rawResult: true,
    };
    if (session) options.session = session;
    // Upsert a user in users collection
    let update = {};
    if (role === 'SH') {
      update = { userType: 'EMPLOYEE_SH' };
    } else if (role === 'SSO') {
      update = { userType: 'EMPLOYEE_SSO' };
    } else if (role === 'CO') {
      update = { userType: 'EMPLOYEE_CO' };
    }
    const user = await UsersService.findOneAndUpdate(conditions, update, options);
    return user.value._id;
  } catch (err) {
    throw new DATA_BASE_ERROR(err);
  }
};

const createEmployee = async (employee) => {
  const { mobileNumber, role } = employee;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    employee.userId = await updateUserFromEmployee(mobileNumber, role, session);
    const data = await insertToEmployee(employee, session);
    await session.commitTransaction();
    return data;
  } catch (err) {
    log.error('abort transaction');
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const editEmployee = async ({ employeeId, newValues }) => {
  try {
    const { role } = newValues;

    const existingEmployees = await Employee.findOne({ employeeId });

    if (newValues.mobileNumber != undefined && existingEmployees.mobileNumber != newValues.mobileNumber) {
      throw new MOBILE_CANT_UPDATE();
    }

    const employee = await Employee.updateOne({ employeeId }, newValues);
    if (role && role !== existingEmployees.role) {
      await updateUserFromEmployee(existingEmployees.mobileNumber, role, undefined);
    }
    return employee;
  } catch (err) {
    throw err;
  }
};

const deleteEmployeeAndUpdateUsers = async (employeeData) => {
  const { userId, employeeId } = employeeData;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await Users.findOneAndUpdate({ _id: userId }, { userType: 'INDIVIDUAL' }, { new: true, session });
    // console.log(user);
    // log.info(user);
    const employee = await Employee.findOneAndUpdate({ employeeId }, { isActive: false }, { new: true, session });
    // const employee = await Employee.deleteOne({ employeeId }).session(session);
    // console.log(employee);
    // log.info(employee);
    await session.commitTransaction();
    return employee;
  } catch (err) {
    // console.log(error);
    // log.error("Error in service::deleteEmployeeAndUpdateUsers function: %s", err);
    // console.error('abort transaction');
    // log.error("Abort transaction")
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

const deleteEmployee = async ({ employeeId }) => {
  try {
    // const { Employees } = db.getInstance();
    const employeeData = await Employee.findOne({ employeeId });
    if (!employeeData) {
      throw new EMPLOYEE_DOES_NOT_EXIST();
    }
    const res = deleteEmployeeAndUpdateUsers(employeeData);
    return res;
  } catch (err) {
    // console.log(err);
    if (err.code === 'EMPLOYEE_DOES_NOT_EXIST') {
      throw err;
    }
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

const countEmployee = async () => {
  try {
    // const { Employees } = db.getInstance();
    const employee = await Employee.countDocuments();
    return employee;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error in counting the employee in DB');
  }
};

const getLastEmployeeId = async () => {
  try {
    // const { Employees } = db.getInstance();
    const employee = await Employee.find({}).sort({createdAt: -1});
    return employee[0].employeeId;
  } catch (err) {
    throw new DATA_BASE_ERROR('Error in counting the employee in DB');
  }
};

const createEmpTree = async (list) => {
  log.info({info: 'Employee Tree service :: inside create Employee tree'});
  let map = {}, node, roots = [], i;
  for (i = 0; i < list.length; i += 1) {
    if (list[i].managerId === '') {
      list[i].managerId = null;
    }
    map[list[i].employeeId] = i; // initialize the map
    list[i] = JSON.parse(JSON.stringify(list[i]));
    list[i].employees = []; // initialize the children

  }
  for (i = 0; i < list.length; i += 1) {
    node = list[i];
    try {
      if (node.managerId && map[node.managerId]) {
        list[map[node.managerId]].employees.push(node);
      } else {
        roots.push(node);
      }
    } catch (err) {
      throw err
    }
  }
  return roots;
};

const findInEmpTree = (emp, phone) => {
  if (emp.mobileNumber === phone) {
    return emp;
  } else if (emp.employees.length != 0) {
    let result = null;
    for (let j = 0; j < emp.employees.length; j++) {
      result = findInEmpTree(emp.employees[j], phone);
      if (result != null) {
        return result;
      }
    }
    return result;
  } else {
    return null;
  }
};

const findInEmpTreeUtil = async (phone, data) => {
  log.info({info:'Employee tree service :: inside find in employee tree'});
  let emp = {};
  let i = 0;
  for (; i < data.length; i++) {
    emp = await findInEmpTree(data[i], phone);
    if (emp != null) {
      return emp;
    }
  }
  throw new EMPLOYEE_DOES_NOT_EXIST();
};

const treeToList = (emp, result) => {
  let employees = emp.employees;
  delete emp.employees;
  result.push(emp);
  if (employees.length > 0) {
    for (let i = 0; i < employees.length; i++) {
      result = treeToList(employees[i], result);
    }
  }
  return result;
};

const removeSSO = async (list) => {
  const result = [];
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].role !== 'SSO') {
      result.push(list[i]);
    }
  }
  return result;
};

const getEmpTree = async ({ phone, onlyManagers }, hasAdminAccess = false) => {
  log.info({info:'Employee Tree service :: inside get employee tree'})
  let result = [];
  const allEmployees = await getAllEmployees();
  if (hasAdminAccess === true) {
    return allEmployees.result;
  }
  const empTree = await createEmpTree(allEmployees.result);
  const empSubTree = await findInEmpTreeUtil(phone, empTree);
  result = treeToList(empSubTree, result);
  onlyManagers = (onlyManagers === 'true');
  if (onlyManagers) {
    result = await removeSSO(result);
  } else {
    result.shift();
  }
  return result;
};

module.exports = {
  getLastEmployeeId,
  uploadFile,
  createEmployee,
  getEmployee,
  getEmployeeCount,
  getAllEmployees,
  editEmployee,
  deleteEmployee,
  countEmployee,
  getEmpTree,
  getEmployeeByUserId
};
