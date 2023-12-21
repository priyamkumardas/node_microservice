const { UsersService, OtpService, ReferService, FavouriteService, RetailerService } = require('@services/v1');
const { env } = require('@config');
const { ENV, ADMIN } = require('@common/utility/constants');
const {
  Logger: log,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  apiServices,
  AuthManager,
  Logger,
} = require('sarvm-utility');

const VERIFY_OTP_ERROR = require('../../../common/libs/ErrorHandler/VERIFY_OTP_ERROR');

const { bizBaseUrl } = require('@config');

const {
  ref_ms: { onStatusUpdate },
  auth: { Token },
} = apiServices;
const { AppData, IsNewUser } = require('./AppUpdate');

const { sendOtpAsync, verifyOTPAsync } = require('../../services/v1/otpServiceAsync');
const { saveFCMToken } = require('../../services/v1/Notification');
const UserController = require('@controllers/v1/Users.js');
const ConsumerController = require('../v1/Consumer');
const { overArgs } = require('lodash');
const { createDeliveryBoy } = require('../../services/v1/Logistics');

//const { FavouriteController } = require('.');

const processToSendOtp = async (params) => {
  log.info({ info: { message: 'Otp Controller :: Inside Provess To Send OTP' } });
  const { phone, headers, medium } = params;
  try {
    let args = {};
    const { status, user } = await UsersService.userHasAdminAccess({
      phone,
      headers,
      whichAdminRoleType: ADMIN.ROLE.ADMIN,
    });
    // const existingUser = await UsersService.findOne({ phone: phone, status: 'ACTIVE' })
    // console.log(existingUser)
    if (status === false) {
      args = await UsersService.upsertUser({ phone });
    } else {
      log.info({ info: 'User Has Admin Access' });
      args = user;
      args.userId = args._id;
    }

    let isNewUser = args.isNewUser;

    let consumer = {
      userId: args.userId,
      proData: {},
    };

    if (headers.app_name == 'householdApp' && isNewUser == true) {
      await ConsumerController.createProfile(consumer);
    }

    if (headers.app_name == 'householdApp' && isNewUser == false) {
      let getConsumerProfileS3 = await ConsumerController.getUserProfileByUserIdFromConsumer({ userId: args.userId });
      if (getConsumerProfileS3.length === 0) {
        await ConsumerController.createProfile(consumer);
      }
    }

    if (headers.app_name === 'logisticsDelivery' && args.isNewUser) {
      //create delivery profile for user;
      createDeliveryBoy({ userId: args.userId });
    }

    delete args.isNewUser;
    // if (env === ENV.DEV) {
    //   const otpReceived = await sendOtpAsync({ args, headers });
    //   return otpReceived;
    // }
    const otpReceived = await OtpService.processToSendOtp({ args, medium });
    const data = {
      isNewUser: args.isNewUser,
    };

    return data;
    // return {
    //   otpReceived,
    //   data: args.isNewUser
    // };
  } catch (err) {
    console.log('error in controller is', err);
    // log.error(`error in inside controller::processToSendOtp method service: ${err}`);
    if (err.key === 'admin') {
      throw err;
    } else {
      throw new VERIFY_OTP_ERROR(err);
    }
  }
};
// const sendOTPOverCall = async (args) => {
//   const otpReceived = await processToSendOtp('sendOTPOverCall', { ...args, medium: MEDIUM.CALL });
//   return otpReceived;
//   // log.info('inside sendOTPOverCall method');
//   // let args;
//   // try {
//   //   args = await UsersService.upsertUser({ phone });
//   //   return OtpService.sendOTPOverCall({ args });
//   // } catch (err) {
//   //   log.error('error in sendOTPOverCall service: %s', err);
//   //   throw new INTERNAL_SERVER_ERROR(err);
//   // }
// };

// const sendOTPOverSms = async (args) => {
//   const otpReceived = await processToSendOtp('sendOTPOverSms', { ...args, medium: MEDIUM.SMS });
//   return otpReceived;
//   // log.info('inside sendOTPOverSMS method');
//   // let response;
//   // try {
//   //   response = await UsersService.upsertUser({ phone });
//   //   return OtpService.sendOTPOverSms({ args: response });
//   // } catch (err) {
//   //   log.error('error in sendOTPOverSMS service: %s', err);
//   //   throw new INTERNAL_SERVER_ERROR(err);
//   // }
// };

const verifyOTP = async ({ otp, phone, deviceId, fcmToken, headers, referredBy, type }) => {
  log.info({ info: 'OTP Controller :: Inside Verify Otp' });

  const { appVersionCode, app_name, lat, lon } = headers;

  const { status, user } = await UsersService.userHasAdminAccess({
    phone,
    headers,
    whichAdminRoleType: ADMIN.ROLE.ADMIN,
  });
  const existingUser = status === false ? await UsersService.findOne({ phone: phone, status: 'ACTIVE' }) : user;

  if (!existingUser) {
    // log.info('function: verifyOTP. you have not sent otp but trying to verify');
    log.info({ info: 'OTP Controller :: you have not sent OTP but trying to verify' });
  }
  const userId = existingUser._id;
  let isOtpVerified;
  try {
    isOtpVerified = await OtpService.verifyOTP({
      otp,
      phone,
      userId,
      headers,
    });
  } catch (err) {
    throw new VERIFY_OTP_ERROR();
  }

  const isNewUser = IsNewUser(existingUser, appVersionCode, app_name);
  const isVeg = isNewUser ? null : existingUser.householdData.isVeg;
  log.info({ info: `OTP Controller :: User is New User or Not ${isNewUser}` });
  // updating OTP verification status for particular App: db structure to be updated here?
  const conditions = { phone: phone, status: 'ACTIVE' };
  const update = await AppData(appVersionCode, app_name, existingUser, isOtpVerified);
  // console.log(update)
  const options = { new: true };
  await UsersService.findOneAndUpdate(conditions, update, options);

  // need to discuss here: if it is require or not= can pull the data from api also?
  const userDetails = {
    _id: userId,
    isVeg: isVeg,
  };
  //call Fcm token service to save token

  await saveFCMToken(userId, deviceId, fcmToken, app_name);

  try {
    const authServiceResponse = await Token({
      headers,
      params: {
        userId,
      },
    });
    const credentials = authServiceResponse.data;
    /* getting profileUrl from consumer database */
    let profileUrl = null;
    if (app_name == 'householdApp') {
      let currentUserProfile = await ConsumerController.getUserProfileByUserIdFromConsumer({ userId: userId });
      if (currentUserProfile.length > 0) {
        profileUrl = `${bizBaseUrl}/consumers/${currentUserProfile[0].s3URL.split('/')[5]}`;
      }
    }
    /* getting profileUrl from consumer database */
    let existingAppName = headers.app_name;
    let referUserId = null;
    let ref_type = null;

    if (isOtpVerified && isNewUser) {
      if (referredBy && type) {
        if (type.includes('consumer')) {
          let userProfile = await ConsumerController.getUserProfileByGuidFromConsumer({ guid: referredBy });
          referUserId = userProfile[0].userId;
          ref_type = app_name == 'householdApp' ? 'INDIVIDUAL' : 'RETAILER';
          headers.app_name = 'householdApp';
        } else if (type.includes('shops')) {
          const data = await RetailerService.getShopByUniqueId(referredBy);
          // const userData = await UserController.getUserById({ userId: data.user_id });
          ref_type = app_name === 'retailerApp' ? 'RETAILER' : 'INDIVIDUAL';
          headers.app_name = 'retailerApp';
          referUserId = data.user_id;
        }

        const inviteBody = {
          phone: phone,
          type: ref_type,
          lat: lat,
          lon: lon,
        };
        const authServiceResponseForRefer = await Token({
          headers,
          params: {
            userId: referUserId,
          },
        });
        headers.app_name = existingAppName;
        const ackPayload = await AuthManager.decode(authServiceResponseForRefer.data.accessToken);
        //after getting token call the invite API
        await ReferService.sendReferInvite(inviteBody, authServiceResponseForRefer.data.accessToken);
      }

      //adding logic to add retailer who refered shop to favourite list
      let ref_data = await ReferService.getRefereeDetails(phone);

      //get the shops based on Retailer Id
      if (ref_data !== null && ref_data.refByUserType === 'RETAILER') {
        console.log('adding favourite');
        log.info({
          info: 'Otp Controller :: Verify OTP, adding shop to favourite for first time referred user by Retailer',
        });
        let shop_data = await RetailerService.getShopsByRetailerId(ref_data.ref_by);
        shop_data.forEach((shop) => {
          FavouriteService.addFavourite(userId, { shopId: shop.shop_id });
        });
      }

      /* add to favourite */
      const { accessToken } = credentials;
      const payload = AuthManager.decode(accessToken);
      //check if this user is refered by some retailer, if yes then call the favourite shop api for that user
      onStatusUpdate({
        body: {
          userType: payload.userType,
          phone: payload.phone,
          stage: 'signup',
          userId: payload.userId,
          flyyUserId: payload.flyyUserId,
          segmentId: payload.segmentId,
        },
        headers: {
          appVersionCode,
          app_name,
          lat,
          lon,
          authorization: `Bearer ${credentials.accessToken}`,
        },
      });
    }

    /* adding profile url to body */
    if (profileUrl !== null) {
      credentials.body.profileUrl = profileUrl;
    }
    if (app_name === 'retailerApp') {
      const shopData = await RetailerService.getShopsByRetailerId(userId.toString());
      credentials.body.profileUrl = shopData.length > 0 ? `${bizBaseUrl}/shops/${shopData[0].guid}` : '';
    }

    return Object.freeze({
      isNewUser,
      ...userDetails,
      ...credentials,
    });
  } catch (err) {
    console.log('error is', err);
    throw new VERIFY_OTP_ERROR(err);
  }
};

const checkIfRegistered = async ({ phone, appVersionCode, appName }) => {
  const conditions = { phone };
  const user = await UsersService.findOne(conditions);
  const isNumberRegistered =
    !(user === null || typeof user === 'undefined') && !IsNewUser(user, appVersionCode, appName);

  // no registered user found for phoneNumber
  // const isNumberRegistered = ;
  return Object.freeze({ isNumberRegistered });
};

module.exports = {
  processToSendOtp,
  verifyOTP,
  checkIfRegistered,
};
