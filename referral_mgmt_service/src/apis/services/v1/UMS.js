const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
} = require("sarvm-utility");

const axios = require("axios");

const { UMS_API_CALL_ERROR } = require("@root/src/apis/errors");

const { load_balancer, system_token } = require("@root/src/config");

const UMS_GETUSER = load_balancer + "/ums/apis/v1/users/";
const UMS_GETEMP = load_balancer + "/ums/apis/v1/employee/";

// const ums_baseurl = "http://localhost";
const check_if_reg = async (appName, phone) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 2000,
    };
    const request = new RequestHandler(config);
    const data = {
      phone: phone,
    };
    const options = {
      headers: {
        app_name: appName,
        app_version_code: 101,
        // Authorization: token,
        Authorization: "Bearer " + system_token,
      },
    };
    let ums_checkIfRegApi = "/ums/apis/v1/users/check_if_reg";
    const response = await request.post(ums_checkIfRegApi, data, options);
    if (response == undefined) {
      throw new UMS_API_CALL_ERROR();
    }
    // console.log("API: ", response.data);
    return response.data.data;
  } catch (err) {
    throw new UMS_API_CALL_ERROR();
  }
};

const getUserDetails = async (id, appName) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 5000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        app_name: appName,
        app_version_code: 101,
        // Authorization:
        // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWZfbXMiLCJzY29wZSI6WyJTWVNURU0iLCJSRUZfTVMiLCJVc2VycyJdLCJpYXQiOjE2NjM4NDAxNjQsIm5iZiI6MTY2Mzg0MDE2NCwiZXhwIjoxNjk1Mzc2MTY0LCJpc3MiOiJzYXJ2bTp1bXMiLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.Fl3FMYS0zjEAlAPj0aNeNMdqLEBy4ImM0dfJm2GrY2A",
        Authorization: "Bearer " + system_token,
      },
    };
    let ums_getUserDetails = "/ums/apis/v1/users/";
    if (id) {
      ums_getUserDetails = "/ums/apis/v1/users/" + id;
    }
    const response = await request.get(ums_getUserDetails, options);
    if (response == undefined) {
      throw new UMS_API_CALL_ERROR();
    }
   // console.log("API: ", response.data);
    return response.data.data;
  } catch (err) {
    
    throw new UMS_API_CALL_ERROR();
  }
};

const getEmployeeDetails = async (args) => {
  try {
    const config = {
      baseURL: load_balancer,
      timeout: 2000,
    };
    const request = new RequestHandler(config);
    const options = {
      headers: {
        // app_name: appName,
        app_version_code: 101,
        // Authorization:
        // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJyZWZfbXMiLCJzY29wZSI6WyJTWVNURU0iLCJSRUZfTVMiLCJVc2VycyJdLCJpYXQiOjE2NjM4NDAxNjQsIm5iZiI6MTY2Mzg0MDE2NCwiZXhwIjoxNjk1Mzc2MTY0LCJpc3MiOiJzYXJ2bTp1bXMiLCJzdWIiOiJhY2Nlc3NUb2tlbiJ9.Fl3FMYS0zjEAlAPj0aNeNMdqLEBy4ImM0dfJm2GrY2A",
        Authorization: "Bearer " + system_token,
      },
    };
    let ums_getEmployeeDetails = "/ums/apis/v1/employee/" + args;

    const response = await request.get(ums_getEmployeeDetails, options);
    if (response == undefined) {
      throw new UMS_API_CALL_ERROR();
    }
    // console.log("API: ", response.data);
    return response.data.data;
  } catch (err) {
    // console.log(err);
    throw new UMS_API_CALL_ERROR();
  }
};

const getUserId = async (phone) => {
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
    // headers: {
    //   app_name: "retailerApp",
    //   app_version_code: "101",
    //   "Content-Type": "application/json",
    //   Authorization:
    //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzMwMGNiNWVhNmEzMDc4MDYyYTIzZmMiLCJwaG9uZSI6Ijk4MTk0ODI3NjciLCJ1c2VyVHlwZSI6IklORElWSURVQUwiLCJzaG9wSWQiOm51bGwsImZseXlVc2VySWQiOiJob3VzZWhvbGQtZWMyZmQ0N2QtYzY5NC00NDU3LTk0YWYtN2U5ODJlYjVmZDM3Iiwic2NvcGUiOlsiVXNlcnMiLCJob3VzZWhvbGRBcHAiXSwiaWF0IjoxNjY0MjEyMjU1LCJuYmYiOjE2NjQyMTIyNTUsImV4cCI6MTY5NTc0ODI1NSwiaXNzIjoic2Fydm06dW1zIiwic3ViIjoiYWNjZXNzVG9rZW4ifQ.GYa0upmZN15HX_vRwoX0CYGeI7fsiV4ldNPjgW8JFsM",
    // },
  };
  let res = {};
  try {
    console.log(UMS_GETUSER + phone);
    res = await axios.get(UMS_GETUSER + phone, options);
  } catch (err) {
    console.log("GET USER ID ERROR");
    // console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result) {
      return result._id;
    } else {
      return null;
    }
  } else {
    throw new Error(error.code);
  }
};

const getManagerDetails = async (args) => {
  const options = {
    headers: {
      app_name: "householdApp",
      app_version_code: 101,
      "Content-Type": "application/json",
      Authorization: `Bearer ${system_token}`,
    },
  };
  let res = {};
  try {
    res = await axios.get(UMS_GETEMP + args, options);
  } catch (err) {
    console.log("GET MANAGER DETAILS ERROR");
    // console.log(err);
    throw new Error(JSON.stringify(err.response.data));
  }
  const { success, data: result, error } = res.data;
  if (success) {
    if (result) {
      return { managerId: result.managerId, phone: result.mobileNumber };
    } else {
      return null;
    }
  } else {
    throw new Error(error.code);
  }
};

module.exports = {
  check_if_reg,
  getUserDetails,
  getUserId,
  getManagerDetails,
  getEmployeeDetails,
};
