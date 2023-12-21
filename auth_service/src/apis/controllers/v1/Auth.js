const db = require('@db');
const { AuthService } = require('@services/v1');
const {
  Logger,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  apiServices,
} = require('sarvm-utility');
const { logisticInformation } = require('../../services/v1/Logistic');

const {
  rms: { getAllShopViaUserId },
} = apiServices;

const verifyToken = async (dataValues) => {
  const { headers } = dataValues;
  const authString = headers.authorization ?? '';
  const jwtToken = authString.split(' ')[1];

  return AuthService.verifyToken(jwtToken);
};

const getUserType = (appName, userType) => {
  if (appName === 'retailerApp') {
    return 'RETAILER';
  }
  else if (appName === 'logisticsDelivery')
  {
    return 'LOGISTICS_DELIVERY'
  }
  else if (appName === 'admin') {
    return 'ADMIN';
  }

  return userType;
};
const getSegment = ({ user, app_name }) => {
  //   "items": [{
  //     "id": 1134,
  //     "key": "sales_employee_sh",
  //     "title": "Sales Employee SH"
  // },
  // {
  //     "id": 1133,
  //     "key": "sales_employee_co",
  //     "title": "Sales Employee CO"
  // },
  // {
  //     "id": 1132,
  //     "key": "sales_employee_sso",
  //     "title": "Sales Employee SSO"
  // },
  // {
  //     "id": 1112,
  //     "key": "1082",
  //     "title": "1082"
  // },
  // {
  //     "id": 1110,
  //     "key": "retailer",
  //     "title": "Retailer"
  // },

  // {
  //     "id": 1082,
  //     "key": "household",
  //     "title": "Household/Individual"
  // },
  // {
  //     "id": 1078,
  //     "key": "all_users",
  //     "title": "All Users"
  // }
  // ]
  if (app_name === 'retailerApp') {
    return 'retailer';
  } else if (app_name === 'householdApp') {
    if (user.userType === 'EMPLOYEE_SH') {
      return 'sales_employee_sh';
    }
    if (user.userType === 'EMPLOYEE_SSO') {
      return 'sales_employee_sso';
    }
    if (user.userType === 'EMPLOYEE_CO') {
      return 'sales_employee_co';
    }
    return 'household';
  } else if (app_name === 'logisticsDelivery') {
    return 'logistics_delivery';
  } else if (app_name === 'admin') {
    if (user.adminData.status === 'active') {
      return user.adminData.role;
      // } else if (user.adminData.status === 'inactive') {
      //   return 'non-admin';
    }
    return 'non-admin';
  }
  // Todo: Throw appropriate error instead of INTERNAL_SERVER_ERROR
  throw new INTERNAL_SERVER_ERROR();
};

const generateGeneralData = (user, headers, body) => {
  const { app_name } = headers;
  const { userId } = body;
  const { phone, userType, flyyUserId } = user.toObject();

  const segmentId = getSegment({ user: user.toObject(), app_name });
  // Todo: Constant should be there in constant file
  const appUserType = getUserType(app_name, userType);

  const payload = {
    userId,
    phone,
    userType: appUserType,
    segmentId,
    flyyUserId: `${app_name.slice(0, -3)}-${flyyUserId}`,
    isEmployee: userType.includes('EMPLOYEE'),
    scope: ['Users', app_name],
  };

  return payload;
};

const generateLogisticData = async (user, headers, body) => {
  const { app_name } = headers;
  const { userId } = body;
  const { phone, userType, flyyUserId } = user.toObject();

  const segmentId = getSegment({ user: user.toObject(), app_name });
  // Todo: Constant should be there in constant file
  const appUserType = getUserType(app_name, userType);

  const { deliveryData } = await logisticInformation(userId);
  let onboardStatus = false;
  let subscribedStatus = false;
  if (deliveryData !== null) {
    const { onbording, subscribed } = deliveryData;
    onboardStatus = onbording;
    subscribedStatus = subscribed;
  }

  const payload = {
    entityType: 'LU',
    entityId: userId,
    userId,
    phone,
    onbording: onboardStatus,
    subscribed: subscribedStatus,
    userType: appUserType,
    segmentId,
    flyyUserId: `${app_name.slice(0, -3)}-${flyyUserId}`,
    isEmployee: userType.includes('EMPLOYEE'),
    scope: ['Users', app_name],
  };
  Logger.info({ info: 'In retailerApp app' });
  return payload;
};

const generateAdminData = async (user, headers, body) => {
  const { app_name } = headers;
  const { userId } = body;

  // needs to update payload : fields to be decided
  const { phone, userType, flyyUserId } = user.toObject();
  const segmentId = getSegment({ user: user.toObject(), app_name });
  // Todo: Constant should be there in constant file
  const appUserType = getUserType(app_name, userType);

  const payload = {
    userId,
    phone,
    userType: appUserType,
    adminData: {
      status: user._doc.adminData.status,
      role: user._doc.adminData.role,
    },
    segmentId,
    flyyUserId: `${app_name.slice(0, -3)}-${flyyUserId}`,
    scope: ['ADMIN'],
  };
  Logger.info({ info: 'In deliveryApp app' });
  return payload;
};

const generateRetailerData = async (user, headers, body) => {
  const { app_name } = headers;
  const { userId } = body;

  let shopId = null;
  let shopUniqueId = null;
  const shopMeta = {
    shop: {
      shop_id: null,
      id: null,
    },
    flag: {
      onBoarding: false,
      isSubscribed: false,
      GST_no: false,
      isKYCVerified: false,
    },
  };
  const shopApiResponse = await getAllShopViaUserId({ headers, body });
  if (shopApiResponse.success === true && shopApiResponse.data.length > 0) {
    shopId = shopApiResponse.data[0].shop_id;
    shopUniqueId = shopApiResponse.data[0].id;
    // eslint-disable-next-line prefer-destructuring
    shopMeta.shop = shopApiResponse.data[0];
    let isSub = false;
    let isKyc = false;
    let isOb = false;
    let gst = false;
    if (shopApiResponse.data[0].isKYCVerified !== null) {
      isKyc = shopApiResponse.data[0].isKYCVerified;
    }
    if (shopApiResponse.data[0].isSubscribed !== null) {
      isSub = shopApiResponse.data[0].isSubscribed;
    }

    if (isKyc && isSub) {
      isOb = true;
    }
    if (shopApiResponse.data[0].GST_no !== null) {
      gst = true;
    }
    shopMeta.flag = {
      onBoarding: isOb,
      isSubscribed: isSub,
      GST_no: gst,
      isKYCVerified: isKyc,
    };
  }

  // needs to update payload : fields to be decided
  const { phone, userType, flyyUserId } = user.toObject();
  const segmentId = getSegment({ user: user.toObject(), app_name });
  // Todo: Constant should be there in constant file
  const appUserType = getUserType(app_name, userType);

  const payload = {
    entityType: 'SU',
    entityId: shopId,
    userId,
    phone,
    userType: appUserType,
    shopId,
    shopUniqueId,
    isEmployee: userType.includes('EMPLOYEE'),
    shopMeta,
    segmentId,
    flyyUserId: `${app_name.slice(0, -3)}-${flyyUserId}`,
    scope: ['Users', app_name],
  };
  Logger.info({ info: 'In retailerApp app' });
  return payload;
};

const getToken = async (dataValues) => {
  Logger.info({ info: 'inside getToken' });
  //Logger.info('inside getToken');
  const { Users } = db.getInstance();
  const { userId, app_name, app_version_code, authorization } = dataValues;
  const user = await Users.findById(userId);

  if (user === null || typeof user === 'undefined') {
    Logger.error({ error: 'user does not exists' });
    const err = new Error('user does not exists');
    throw new INTERNAL_SERVER_ERROR(err);
  }

  // call rms for shopId to include in payload
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    app_name,
    app_version_code,
    Authorization: authorization,
  };

  const body = {
    userId,
  };

  let payload = {};
  if (app_name === 'retailerApp') {
    payload = await generateRetailerData(user, headers, body);
  } else if (app_name === 'admin') {
    payload = await generateAdminData(user, headers, body);
  } else if (app_name === 'logisticsDelivery') {
    payload = await generateLogisticData(user, headers, body);
  } else {
    payload = await generateGeneralData(user, headers, body);
  }

  return AuthService.issueToken(payload);
};

const getUnauthorizeToken = async (dataValues) => {
  // needs to update payload : fields to be decided
  const { app_name, app_version_code } = dataValues;
  const payload = {
    userId: 'anonymous',
    scope: [app_name],
  };
  Logger.info({ info: 'payload' });
  return AuthService.issueToken(payload);
};
const generateToken = async (payload) => AuthService.issueToken(payload);

module.exports = {
  verifyToken,
  getUnauthorizeToken,
  getToken,
  generateToken,
};
