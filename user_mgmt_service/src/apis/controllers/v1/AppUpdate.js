const { Logger: log } = require("sarvm-utility");


const IsNewUser = (user, app_version_code, app_name) => {
  log.info({info: `App Update :: Inside Is New User${app_name}`})
  if (user === null || typeof user === 'undefined') {
    return false;
  }
  if (app_name === 'retailerApp') {
    return !user.retailerData.isOtpVerified;
  }
  if (app_name === 'householdApp') {
    return !user.householdData.isOtpVerified;
  }
  if (app_name === 'logisticsDelivery') {
    return !user.deliveryData.isOtpVerified;
  }
  return true;
};

const AppData = async (app_version_code, app_name, user, newValues) => {
  log.info({info: 'App Update :: Inside App Data'})
  const isOtpVerified = newValues ? newValues : false;
  if (app_name === 'retailerApp') {
    const prevAppData = user === null || typeof user === 'undefined' ? null : user.retailerData;

    return Object.freeze({
      retailerData: {
        ...prevAppData,
        isOtpVerified,
        lastLogin: new Date(),
      },
    });
  }

  if (app_name === 'logisticsDelivery') {
    const prevAppData = user === null || typeof user === 'undefined' ? null : user.deliveryData;

    return Object.freeze({
      deliveryData: {
        ...prevAppData,
        isOtpVerified,
        lastLogin: new Date(),
      },
    });
  }

  if (app_name === 'householdApp') {
    const prevAppData = user === null || typeof user === 'undefined' ? null : user.householdData;

    return Object.freeze({
      householdData: {
        ...prevAppData,
        isOtpVerified,
        lastLogin: new Date(),
      },
    });
  }
};

const UpdateAppData = async (app_name, app_version_code, user, newValues) => {
  if (app_name === 'retailerApp') {
    const newAppData = 'retailerData' in newValues ? newValues.retailerData : user.retailerData;
    Object.assign(user.retailerData, newAppData);
  }
  if (app_name === 'logisticsDelivery') {
    const newAppData = 'deliveryData' in newValues ? newValues.deliveryData : user.deliveryData;
    Object.assign(user.deliveryData, newAppData);
  }
  if (app_name === 'householdApp') {
    const newAppData = 'householdData' in newValues ? newValues.householdData : user.householdData;
    Object.assign(user.householdData, newAppData);
  }
  if('basicInformation' in newValues) {
    //can not use assign here as basic information might not be own property of user object
    //case when user didn't updated about me section
    user.basicInformation = newValues.basicInformation
  }

  return Object.freeze(user);
};

const checkProfileCompletion = async (app_name, app_version_code, user) => {
  log.info({info : 'inside check Profile Completion'});
  console.log(user);
  if (app_name === 'retailerApp') {
    if (user.retailerData.isProfileCompleted === false) {
      const { userName, address } = user.retailerData;
      return userName !== null && address !== null;
    }
    return false;
  }
  if (app_name === 'logisticsDelivery') {
    if (user.deliveryData.isProfileCompleted === false) {
      const { userName, address } = user.deliveryData;
      return userName !== null && address !== null;
    }
    return false;
  }
  if (app_name === 'householdApp') {
    if (user.householdData.isProfileCompleted === false) {
      const { userName, address } = user.householdData;
      return userName !== null && address !== null;
    }
    return false;
  }
  return false;
};

module.exports = {
  AppData,
  IsNewUser,
  UpdateAppData,
  checkProfileCompletion,
};
