const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');
var mongoose = require('mongoose');

const { inviteLimit, reminderLimit, emails, env, rewards } = require('@root/src/config');
const {
  ReferralsService,
  UMService,
  WalletService,
  RewardsService,
  ReportService,
  RMService,
  SubscriptionService,
} = require('@root/src/apis/services/v1');
const {
  SELF_INVITE_ERROR,
  ALREADY_REGISTERED_USER_ERROR,
  INVITE_LIMIT_REACHED_ERROR,
  SEND_INVITE_ERROR,
  APPNAME_UNDEFINED_ERROR,
  REMINDER_LIMIT_REACHED_ERROR,
  ACTIVE_REF_STATUS_ERROR,
  REFERRAL_UPDATE_ERROR,
  REWARDS_COULD_NOT_BE_ADDED,
} = require('@root/src/apis/errors');
const ACTIVE_STATUS = 'ACTIVE';
const EXPIRED_STATUS = 'EXPIRED';
const {
  INDIVIDUAL: individualCampaign,
  RETAILER: retailerCampaign,
  EMPLOYEE_SSO: employeeSsoCampaign,
  EMPLOYEE_CO: employeeCoCampaign,
  EMPLOYEE_SH: employeeShCampaign,
  LOGISTICS_DELIVERY: logisticsCampaign,
} = require('./Campaign');
const { getSubscriptionData } = require('@services/v1/Report');
const { sendEmail } = require('@common/libs/Email/sesSendEmail');
const { getOrderCountByPhoneNumber } = require('../../services/v1/Referral');
let app_type_mapper = {
  INDIVIDUAL: 'householdApp',
  RETAILER: 'retailerApp',
  EMPLOYEE: 'householdApp',
  LOGISTICS_DELIVERY: 'logisticsDelivery',
};

const rewardValue = 120;

const invite = async ({
  refBy,
  refByPhone,
  refByUserType,
  refByFlyyUserId,
  refBySegmentId,
  phone,
  type,
  token,
  location,
}) => {
  console.log(
    refBy,
    refByPhone,
    refByUserType,
    refByFlyyUserId,
    refBySegmentId,
    phone,
    type,
    token,
    location
  );
  try {
    // Todo: Check if the user has invites limit left
    log.info({ info: 'Refferal controller :: inside invite' });
    const sentInvites = await ReferralsService.checkSentInvites(refBy);
    if (sentInvites == inviteLimit) {
      log.warn({ warn: 'invite limit reached' });
      throw new INVITE_LIMIT_REACHED_ERROR();
    }

    // Check if the user is inviting himself
    if (refByPhone === phone) {
      throw new SELF_INVITE_ERROR();
    }

    // Check if the app name sent by front-end exists in the appName mapper
    const appName = app_type_mapper[type];
    if (appName === undefined) {
      throw new APPNAME_UNDEFINED_ERROR();
    }

    // Check if the number if already registered. Make an api call to UMS
    const { isNumberRegistered } = await UMService.check_if_reg(appName, phone);
    if (isNumberRegistered) {
      throw new ALREADY_REGISTERED_USER_ERROR();
    }
    // Check if the user doesn't have any ACTIVE referrals
    const active_ref_status = await ReferralsService.checkIfReferralActive(
      type,
      phone,
      ACTIVE_STATUS
    );
    if (active_ref_status) {
      throw new ACTIVE_REF_STATUS_ERROR();
    }

    // Todo: Implement messaging sevice api to send sms
    let invite_status = false;
    invite_status = await ReferralsService.invite(refBy, phone, type);

    // Insert the document in referrals collection
    if (invite_status) {
      if (refByUserType === 'INDIVIDUAL') {
        campaign = individualCampaign[type];
      } else if (refByUserType === 'RETAILER') {
        campaign = retailerCampaign[type];
      } else if (refByUserType === 'EMPLOYEE_SSO') {
        campaign = employeeSsoCampaign[type];
      } else if (refByUserType === 'EMPLOYEE_SH') {
        campaign = employeeShCampaign[type];
      } else if (refByUserType === 'EMPLOYEE_CO') {
        campaign = employeeCoCampaign[type];
      } else if (refByUserType === 'LOGISTICS_DELIVERY') {
        campaign = logisticsCampaign[type];
      } else {
        throw new SELF_INVITE_ERROR();
      }
      // const campaign = CAMPAIGN[type];
      const doc = {
        ref_by: refBy,
        refByPhone: refByPhone,
        refByUserType: refByUserType,
        refByFlyyUserId: refByFlyyUserId,
        refBySegmentId: refBySegmentId,
        type: type,
        phone_number: phone,
        ref_status: ACTIVE_STATUS,
        campaign: campaign, // Need to confirm the other fields for ack in compaign??
        location: location, //as per asked
      };
      let insertRefStatus = await ReferralsService.create(doc);
      return insertRefStatus;
    }
    throw new SEND_INVITE_ERROR();
  } catch (err) {
    log.error({ error: err });
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const generateReferralCode = async (userId, userName) => {
  log.info({ info: 'Refferral Controller :: inside generate Refferal code' });
  return ReferralsService.generateReferralCode(userId, userName);
};

const sendReminder = async (ref_by, type, phone_number) => {
  try {
    // Check for RemenderCount if count is less or equal to limit send reminder
    log.info({ info: 'Refferal controller :: inside send reminder' });
    let reminderCount = await ReferralsService.getReminderCount(
      ref_by,
      type,
      phone_number,
      ACTIVE_STATUS // ref_status as active
    );
    if (reminderCount == reminderLimit) {
      throw new REMINDER_LIMIT_REACHED_ERROR();
    }
    const send_reminder_status = await ReferralsService.sendReminder(ref_by, phone_number);
    if (send_reminder_status) {
      await ReferralsService.updateReminderCount(ref_by, type, phone_number);
      return true;
    }
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const getRefByUserType = (appName) => {
  const refByUserType = [];
  switch (appName) {
    case 'retailerApp': {
      refByUserType.push('RETAILER');
      break;
    }
    case 'householdApp': {
      refByUserType.push('INDIVIDUAL');
      refByUserType.push('EMPLOYEE_SSO');
      refByUserType.push('EMPLOYEE_SH');
      refByUserType.push('EMPLOYEE_CO');
      break;
    }

    case 'logisticsDelivery': {
      refByUserType.push('LOGISTICS_DELIVERY');
      break;
    }
  }
  return refByUserType;
};
const referral = async (ref_by, refByPhone, app_name) => {
  log.info({ info: 'Refferal Controller :: inside referral' });
  try {
    let individual_details = [];
    let retailer_details = [];
    let logistic_details = [];
    let total_reward_recieved = 0;
    const refByUserType = getRefByUserType(app_name);

    let [users, cashbackAmount] = await Promise.all([
      ReferralsService.read(ref_by, refByUserType),
      RewardsService.getCashbackAmount(refByPhone),
    ]);
    let users_invited = ReferralsService.getPercentUsersInvited(users);
    total_reward_recieved += cashbackAmount;
    for (var index = 0; index < users.length; index++) {
      let user = users[index];
      user['max_reward'] = rewardValue;

      user['masked_phone_number'] = user['phone_number'];

      if (user.type == 'INDIVIDUAL') {
        let complete_status = false;
        if (
          user.campaign.ack.status &&
          user.campaign.signup.status &&
          user.campaign.profile_completion.status &&
          user.campaign.order_completed.status
        ) {
          complete_status = true;
        }
        user['stages'] = [
          {
            name: 'signup',
            value: user.campaign.signup.status,
            show: true,
          },
          {
            name: 'profile',
            value: user.campaign.profile_completion.status,
            show: true,
          },
          {
            name: 'order',
            value: user.campaign.order_completed.status,
            show: true,
          },
          {
            name: 'all',
            value: true,
            show: false,
          },
          {
            name: 'complete',
            value: complete_status,
            show: false,
          },
          {
            name: 'incomplete',
            value: !complete_status,
            show: false,
          },
        ];
        user['ack_status'] = user.campaign.ack.status;
        user['referral_reward_status'] = user.campaign.referral_reward.status;

        if (user.campaign.ack.status == true) {
          total_reward_recieved = total_reward_recieved + user.campaign.ack.rewardAmount;
        }

        if (user.campaign.signup.status == true) {
          total_reward_recieved = total_reward_recieved + user.campaign.signup.rewardAmount;
        }
        if (user.campaign.profile_completion.status == true) {
          total_reward_recieved =
            total_reward_recieved + user.campaign.profile_completion.rewardAmount;
        }
        if (user.campaign.order_completed.status == true) {
          total_reward_recieved =
            total_reward_recieved + user.campaign.order_completed.rewardAmount;
        }
        delete user['campaign'];
        individual_details.push(user);
      } else if (user.type == 'RETAILER') {
        let complete_status = false;
        if (
          user.campaign.ack.status == true &&
          user.campaign.kyc.status == true &&
          user.campaign.buy_subscription.status == true &&
          user.campaign.order_completed.status == true
        ) {
          complete_status = true;
        }
        user['stages'] = [
          {
            name: 'kyc',
            value: user.campaign.kyc.status,
            show: true,
          },
          {
            name: 'subscription',
            value: user.campaign.buy_subscription.status,
            show: true,
          },
          {
            name: 'order',
            value: user.campaign.order_completed.status,
            show: true,
          },
          {
            name: 'all',
            value: true,
            show: false,
          },
          {
            name: 'complete',
            value: complete_status,
            show: false,
          },
          {
            name: 'unsubscribe',
            value: !user.campaign.buy_subscription.status,
            show: false,
          },
          {
            name: 'incomplete',
            value: !complete_status,
            show: false,
          },
        ];

        user['ack_status'] = user.campaign.ack.status;
        user['referral_reward_status'] = user.campaign.referral_reward.status;

        if (user.campaign.ack.status == true) {
          // user["ack_status"] = true;
          total_reward_recieved = total_reward_recieved + user.campaign.ack.rewardAmount;
        }
        if (user.campaign.kyc.status == true) {
          // user["kyc_status"] = true;
          total_reward_recieved = total_reward_recieved + user.campaign.kyc.rewardAmount;
        }
        if (user.campaign.buy_subscription.status == true) {
          // user["subscription_status"] = true;
          total_reward_recieved =
            total_reward_recieved + user.campaign.buy_subscription.rewardAmount;
        }
        if (user.campaign.order_completed.status == true) {
          // user["order_status"] = true;
          total_reward_recieved =
            total_reward_recieved + user.campaign.order_completed.rewardAmount;
        }
        delete user['campaign'];
        retailer_details.push(user);
      } else if (user.type == 'LOGISTICS_DELIVERY') {
        let complete_status = false;
        if (
          user.campaign.ack.status == true &&
          user.campaign.kyc.status == true &&
          user.campaign.buy_subscription.status == true &&
          user.campaign.order_completed.status == true
        ) {
          complete_status = true;
        }
        user['stages'] = [
          {
            name: 'kyc',
            value: user.campaign.kyc.status,
            show: true,
          },
          {
            name: 'subscription',
            value: user.campaign.buy_subscription.status,
            show: true,
          },
          {
            name: 'order',
            value: user.campaign.order_completed.status,
            show: true,
          },
          {
            name: 'all',
            value: true,
            show: false,
          },
          {
            name: 'complete',
            value: complete_status,
            show: false,
          },
          {
            name: 'unsubscribe',
            value: !user.campaign.buy_subscription.status,
            show: false,
          },
          {
            name: 'incomplete',
            value: !complete_status,
            show: false,
          },
        ];

        user['ack_status'] = user.campaign.ack.status;
        user['referral_reward_status'] = user.campaign.referral_reward.status;

        if (user.campaign.ack.status == true) {
          // user["ack_status"] = true;
          total_reward_recieved = total_reward_recieved + user.campaign.ack.rewardAmount;
        }
        if (user.campaign.kyc.status == true) {
          // user["kyc_status"] = true;
          total_reward_recieved = total_reward_recieved + user.campaign.kyc.rewardAmount;
        }
        if (user.campaign.buy_subscription.status == true) {
          // user["subscription_status"] = true;
          total_reward_recieved =
            total_reward_recieved + user.campaign.buy_subscription.rewardAmount;
        }
        if (user.campaign.order_completed.status == true) {
          // user["order_status"] = true;
          total_reward_recieved =
            total_reward_recieved + user.campaign.order_completed.rewardAmount;
        }
        delete user['campaign'];
        logistic_details.push(user);
      }
    }
    //for retailer array should be reversed
    let data = {};
    const RETAILER = {
      type: 'Retailer',
      filter: [
        {
          key: 'all',
          value: 'All',
        },
        {
          key: 'order',
          value: 'Order',
        },
        {
          key: 'subscription',
          value: 'Subscribed',
        },
        {
          key: 'unsubscribe',
          value: 'Unsubscribed',
        },
        {
          key: 'ratings',
          value: 'Ratings',
        },
      ],
      details: retailer_details,
    };
    const HOUSEHOLD = {
      type: 'Consumer',
      filter: [
        {
          key: 'all',
          value: 'All',
        },
        {
          key: 'complete',
          value: 'Completed',
        },
        {
          key: 'incomplete',
          value: 'Incompleted',
        },
        {
          key: 'order',
          value: 'Order',
        },
        {
          key: 'ratings',
          value: 'Ratings',
        },
        {
          key: 'signup',
          value: 'SignUp',
        },
      ],
      details: individual_details,
    };

    const LOGISTICS_DELIVERY = {
      type: 'Delivery Valet',
      filter: [
        {
          key: 'all',
          value: 'All',
        },
        {
          key: 'order',
          value: 'Order',
        },
        {
          key: 'subscription',
          value: 'Subscribed',
        },
        {
          key: 'unsubscribe',
          value: 'Unsubscribed',
        },
        {
          key: 'ratings',
          value: 'Ratings',
        },
      ],
      details: logistic_details,
    };

    let types = [];
    if (app_name === 'retailerApp') {
      types = [RETAILER, HOUSEHOLD, LOGISTICS_DELIVERY];
    } else if (app_name === 'householdApp') {
      types = [HOUSEHOLD, RETAILER, LOGISTICS_DELIVERY];
    } else if (app_name === 'logisticsDelivery') {
      types = [LOGISTICS_DELIVERY, HOUSEHOLD, RETAILER];
    } else {
      throw new APPNAME_UNDEFINED_ERROR();
    }
    data = {
      ref_code: ref_by,
      users_invited: users_invited,
      max_reward: rewardValue,
      total_reward_recieved: total_reward_recieved,

      types,
    };

    return data;
  } catch (err) {
    log.error({ error: err });
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onAcknowledgement = async (type, phone_number) => {
  try {
    let update = {
      ack_status: true,
    };
    return await ReferralsService.update(type, phone_number, update);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onSignup = async (type, phone_number) => {
  try {
    let update = {
      ack_status: true,
      signup_status: true,
    };
    return await ReferralsService.update(type, phone_number, update);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onProfileCompletion = async (type, phone_number) => {
  try {
    let update = {
      profile_completion_status: true,
    };
    return await ReferralsService.update(type, phone_number, update);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onFirstOrder = async (type, phone_number) => {
  try {
    let update = {
      first_order_status: true,
    };
    return await ReferralsService.update(type, phone_number, update);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onRewardRecieved = async (ref_by, type, phone_number) => {
  // Update the referrals collection
  let update = {
    referral_reward_status: true,
  };
  //Todo: Handle it via transaction
  let ref_update_status = await ReferralsService.update(type, phone_number, update);

  // Update the total rewards collection
  if (ref_update_status.status) {
    total_reward_update_status = await ReferralsService.updateRewardsRecieved(ref_by);
    if (total_reward_update_status.status) {
      return {
        status: true,
      };
    } else {
      // * * *
      // if the reward collection is not updated then the referral collection should not be updated
      // either. So roll back the changes made
      update = {
        referral_reward_status: false,
      };
      ref_update_status = await ReferralsService.update(type, phone_number, update);
      if (ref_update_status.status) {
        return total_reward_update_status;
      }
      return {
        status: false,
        errorObj: {
          code: 'TRANSACTION_ERROR',
          message: 'TRANSACTION ERROR. ATOMICITY HINDERED.',
        },
      };
    }
  } else {
    return {
      status: false,
      errorObj: {
        code: 'REFERRAL_UPDATE_ERROR',
        message: 'Error updating Referral Collection',
      },
    };
  }
};

const updateRatings = async ({ phone_number, ratings, comments, type, userId }) => {
  //userId
  try {
    const filter = {
      phone_number,
      type,
    };
    JSON.stringify(filter);
    const options = {
      new: true,
    };
    const updateObj = {};
    updateObj.ratings = ratings;

    let update;
    if (comments === '' || comments === undefined || comments === null) {
      update = { $set: updateObj };
    } else {
      update = { $set: updateObj, $push: { comments: comments } };
    }

    // let update = { $set: updateObj };

    const result = await ReferralsService.updateRatings(filter, update, options);
    return result;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR();
  }
};

const updateTransfer = async ({
  userId,
  ref_by,
  refByPhone,
  refByUserType,
  refByFlyyUserId,
  refBySegmentId,
}) => {
  try {
    const filter = {
      _id: {
        $eq: mongoose.mongo.ObjectId(userId),
      },
    };
    const options = {
      new: true,
    };
    const updateObj = {};
    updateObj.ref_by = ref_by;
    updateObj.refByPhone = refByPhone;
    updateObj.refByUserType = refByUserType;
    updateObj.refByFlyyUserId = refByFlyyUserId;
    updateObj.refBySegmentId = refBySegmentId;
    let update = { $set: updateObj };

    const result = await ReferralsService.updateTransfer(filter, update, options);
    return result;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR();
  }
};

const onStatusUpdate = async (userId, type, phone, stage, segmentId, flyyUserId) => {
  log.info({ info: 'Refferal Controller :: inside on status update' });
  try {
    // if (stage == "buy_subscription") {
    //   const referrer = await ReferralsService.getReferralDetails(phone);
    //   if (referrer?.refByUserType.startsWith("EMPLOYEE")) {
    //     const emailData = await getSubscriptionData(userId);

    //     sendEmail({
    //       to: [emails.welcome],
    //       subject: ` ${emailData.state} - ${emailData.retailerPinCode} - ${emailData.retailerContactNumber} -  ${emailData.retailersName}`,
    //       body: `<span style="white-space: pre-line">Retailer's Contact Number: ${emailData.retailerContactNumber}\r\n
    //       Retailer's Name:${emailData.retailersName}\r\n
    //       Retailer PinCode:${emailData.retailerPinCode}\r\n
    //       City:${emailData.city}\r\n
    //       Referred By Phone: ${emailData.referredByPhone}\r\n
    //       Referred By Employee:  ${emailData.referredByEmployee}\r\n
    //       Employee Manager Phone:${emailData.employeeManagerPhone}\r\n
    //       employeeManagersManagerPhone: ${emailData.employeeManagersManagerPhone}\r\n
    //       stateHeadName: ${emailData.stateHeadName}\r\n
    //       amountPaid:  ${emailData.amountPaid}\r\n
    //       DateOfPurchase: ${emailData.DateOfPurchase}\r\n</span>`,
    //     });
    //   } else {
    //     const emailData = await getSubscriptionData(userId);
    //     sendEmail({
    //       to: [emails.welcome],
    //       subject: `Direct - ${emailData.state} - ${emailData.retailerPinCode} - ${emailData.retailerContactNumber} -  ${emailData.retailersName}`,
    //       body: `<span style="white-space: pre-line">Retailer's Contact Number: ${emailData.retailerContactNumber}\r\n
    //       Retailer's Name:${emailData.retailersName}\r\n
    //       Retailer PinCode:${emailData.retailerPinCode}\r\n
    //       City:${emailData.city}\r\n
    //       Referred By Phone: ${emailData.referredByPhone}\r\n
    //       Referred By Employee:  ${emailData.referredByEmployee}\r\n
    //       Employee Manager Phone:${emailData.employeeManagerPhone}\r\n
    //       employeeManagersManagerPhone: ${emailData.employeeManagersManagerPhone}\r\n
    //       stateHeadName: ${emailData.stateHeadName}\r\n
    //       amountPaid:  ${emailData.amountPaid}\r\n
    //       DateOfPurchase: ${emailData.DateOfPurchase}\r\n</span>`,
    //     });
    //   }
    // }
    if (stage == 'buy_subscription') {
      // CASE: USER BOUGHT SUBSCRIPTION BUT WAS NOT REFERED BY ANYONE
      // ReportService.sendSubscriptionAlertEmail("report", userId);
      const referrer = await ReferralsService.getReferralDetails(phone);
      if (!referrer) {
        await WalletService.sendCashback(userId, type, phone, stage, segmentId, flyyUserId);
        return true;
      } else {
        //CASE: SUBSCRIPTION RENEWAL
        if (referrer.campaign?.buy_subscription?.status) {
          //Just send the rewards
          await WalletService.sendSubscriptionRenewalReward(
            referrer._id,
            userId,
            type,
            phone,
            stage
          );
        } else {
          // CASE: IF RETAILER IS REFERRED BY EMPLOYEE MAKE AN API CALL TO RMS
          if (referrer.refByUserType.startsWith('EMPLOYEE')) {
            await RMService.assignManagerToRetailer(referrer.refBy, userId);
          }
        }
      }
    }
    // if type is blank then type should be the type of last referral
    if (type == '') {
      type = await ReferralsService.getLatestReferralType(phone, ACTIVE_STATUS);
    }

    if (stage === 'signup') {
      // "campaign.ack.status": true,
      let updateObj = {
        $set: {
          'campaign.ack.updatedAt': new Date(),
        },
      };
      await ReferralsService.update(type, phone, updateObj);
    }

    if (type === 'INDIVIDUAL') {
      // todo: add other stages to validation
      if (
        stage != 'ack' &&
        stage != 'signup' &&
        stage != 'profile_completion' &&
        stage != 'order_completed'
      ) {
        throw new REFERRAL_UPDATE_ERROR();
      }
    }
    console.log('type is', type);
    console.log('stage is', stage);
    if (type === 'RETAILER') {
      if (
        stage != 'ack' &&
        stage != 'kyc' &&
        stage != 'buy_subscription' &&
        stage != 'order_completed'
      ) {
        throw new REFERRAL_UPDATE_ERROR();
      }
    }

    if (type === 'LOGISTICS_DELIVERY') {
      if (
        stage != 'ack' &&
        stage != 'kyc' &&
        stage != 'buy_subscription' &&
        stage != 'order_completed'
      ) {
        throw new REFERRAL_UPDATE_ERROR();
      }
    }

    console.log('type is', type);
    const filter = {
      type: {
        $eq: type,
      },
      phone_number: {
        $eq: phone,
      },
      ref_status: {
        $eq: ACTIVE_STATUS,
      },
    };
    const options = {
      new: true,
    };

    const update1 = 'campaign.' + stage + '.status';
    const update2 = 'campaign.' + stage + '.updatedAt';
    const updateObj = {};
    updateObj[update1] = true;
    updateObj[update2] = new Date();

    let update = { $set: updateObj };

    // Send an API call Wallet service
    await WalletService.sendUserDetailsToWallet(userId, type, phone, stage, segmentId, flyyUserId);

    // send the rewards that were on hold due to this retailer
    if (stage === 'buy_subscription') {
      await RewardsService.moveHoldRewardsUtil(userId);
    }

    const res = await ReferralsService.onStatusUpdate(filter, update, options);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const onReferralExpired = async () => {
  log.info({ info: 'Refferal Controller :: inside on Referral Expired' });
  try {
    const expiryLimit = 0;
    const date = new Date();
    date.setDate(date.getDate() - expiryLimit);
    console.log(date);
    return ReferralsService.setRefStatusExpired(date, EXPIRED_STATUS);
  } catch (err) {
    if (err.key === 'ref_ms') {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const updateReferrerDetails = async (refByPhone, phone_number) => {
  // get details for new referrer
  let newReferrer = UMService.getUserDetails(refByPhone);

  console.log(newReferrer);

  // set the exsisting referral to TRANSFERRED

  // Create a new referral using the newReferrer details
};

const generateReport = async (startDate, endDate) => {
  return ReportService.generateReport(startDate, endDate);
};

const checkIfOrderConditionComplete = async (retailerPhone, amount, order_id) => {
  await ReferralsService.createOrder(retailerPhone, amount, order_id);
  const orders = await ReferralsService.getOrders(retailerPhone);
  let totalAmount = 0;
  if (orders) {
    for (let i = 0; i < orders.length; i++) {
      totalAmount += orders[i].amount;
    }
    if (totalAmount > 100 && orders.length >= 3) {
      return true;
    }
  }
  return false;
};

const onOrderComplete = async (retailerPhone, customerPhone, amount, order_id, logisticsPhone) => {
  // CASE 1 : IF CUSTOMER HAS A REFERRER
  log.info({ info: 'Refferal controller :: inside on order complete' });
  const refByCust = await ReferralsService.getReferrer(customerPhone, 'INDIVIDUAL');
  if (refByCust) {
    giveHouseholdReward(refByCust, customerPhone, retailerPhone, logisticsPhone);
  }
  // CASE 2 : IF RETAILER HAS A REFERRER
  const refByRet = await ReferralsService.getReferrer(retailerPhone, 'RETAILER');

  if (refByRet) {
    giveRetailerReward(refByRet, customerPhone, retailerPhone, logisticsPhone);
  }
  //CASE 3 : IF LOGISTICS PERSON HAS A REFERRER

  const refByLogistics = await ReferralsService.getReferrer(logisticsPhone, 'LOGISTICS_DELIVERY');

  if (refByLogistics) {
    giveLogisticsReward(refByLogistics, customerPhone, retailerPhone, logisticsPhone);
  }
};

const giveEmployeeReward = async (ref, referredPhone) => {
  console.log('inside give Employee Reward');
  try {
    //const emp = await UMService.getEmployeeDetails(ref.refByPhone);
    // const manager = await UMService.getEmployeeDetails(emp.managerId);
    // const refByCO = await UMService.getUserDetails(
    //   manager.userId,
    //   "householdApp"
    // );
    if (ref.refByUserType === 'EMPLOYEE_CO') {
      WalletService.orderRewardsToWallet(ref, ref.type);
    } else if (ref.refByUserType === 'EMPLOYEE_SHO') {
      WalletService.orderRewardsToWallet(ref, ref.type);
    } else if (ref.refByUserType === 'EMPLOYEE_SSO') {
      WalletService.orderRewardsToWallet(ref, ref.type);
    }
  } catch (err) {
    console.log('error in finding user details');
  }
};

const giveHouseholdReward = async (refByCust, customerPhone, retailerPhone, logisticsPhone) => {
  if (refByCust) {
    // send reward to referrer
    if (!refByCust.campaign.order_completed.status) {
      //if order_completed status is true, means reward is already given for this step
      // update the referral collection
      const filter = {
        type: {
          $eq: 'INDIVIDUAL',
        },
        phone_number: {
          $eq: customerPhone,
        },
        ref_status: {
          $eq: ACTIVE_STATUS,
        },
      };
      const options = {
        new: true,
      };
      let update = { $set: { 'campaign.order_completed.status': true } };
      var isOrderConditionComplete = true;
      var orderCompleteCount = 0;
      const householdOrders = await getOrderCountByPhoneNumber(customerPhone, 'INDIVIDUAL');
      console.log('household orders length is', householdOrders);

      if (householdOrders.length) {
        for (let i = 0; i < householdOrders.length; i++) {
          if (householdOrders[i].status == 'COMPLETED' && householdOrders[i].amount > 100) {
            orderCompleteCount++;
          }
        }
      }
      console.log('order complete count', orderCompleteCount, rewards.rewardHouseholdOrderCount);
      isOrderConditionComplete =
        orderCompleteCount == rewards.rewardHouseholdOrderCount ? true : false;

      //if household completed three order than procced with rewards else not
      if (isOrderConditionComplete) {
        if (refByCust.refByUserType === 'RETAILER') {
          console.log('Referrer of cust is a retailer');
          // get shopId for the retailer
          const retailer = await RMService.getShopDetails(refByCust.ref_by);
          const shopId = retailer.shop_id;
          console.log('Shop id: ', shopId);
          //check if subscription bought
          const subs = await SubscriptionService.getSubscriptionbyShopId(shopId); //appName,shopId
          console.log(subs);
          if (subs) {
            await WalletService.orderRewardsToWallet(refByCust, 'INDIVIDUAL');
          } else {
            //HOLD THE REWARDS
            console.log('No subscription. Hold the rewards');
            await WalletService.holdOrderRewardsToWallet(refByCust, 'INDIVIDUAL', refByCust.ref_by);
          }
        } else if (refByCust.refByUserType === 'LOGISTICS_DELIVERY') {
          console.log('Referrer of cust is a logistics');
          //write logic to check subscription bought or not
          const subs = await SubscriptionService.getLogisticSubscriptionByPhone(
            refByCust.refByPhone
          );
          if (subs) {
            await WalletService.orderRewardsToWallet(refByCust, 'INDIVIDUAL');
          } else {
            console.log('No subscription. Hold the rewards');
            await WalletService.holdOrderRewardsToWallet(refByCust, 'INDIVIDUAL', refByCust.ref_by);
          }
        } else if (refByCust.refByUserType.includes('EMPLOYEE')) {
          giveEmployeeReward(refByCust, customerPhone);
        } else {
          console.log('Referrer of cust is NOT a retailer');
          await WalletService.orderRewardsToWallet(refByCust, 'INDIVIDUAL');
        }
        const updated = await ReferralsService.onStatusUpdate(filter, update, options);
      } else {
        console.log('Household order condition not done');
      }
    }
  }
};
const giveRetailerReward = async (refByRet, customerPhone, retailerPhone, logisticsPhone) => {
  console.log('Found the referrer of retailer.');
  if (!refByRet.campaign.order_completed.status) {
    var isOrderConditionComplete = true;
    var orderCompleteCount = 0;
    const retailerOrders = await getOrderCountByPhoneNumber(retailerPhone, 'RETAILER');
    console.log('retailerOrders length is', retailerOrders.length);
    if (retailerOrders.length) {
      for (let i = 0; i < retailerOrders.length; i++) {
        if (retailerOrders[i].status == 'COMPLETED' && retailerOrders[i].amount > 100) {
          orderCompleteCount++;
        }
      }
    }
    isOrderConditionComplete =
      orderCompleteCount == rewards.rewardRetailerOrderCount ? true : false;

    if (isOrderConditionComplete) {
      console.log('Order conditions done');
      // update referrals collection
      const filter = {
        type: {
          $eq: 'RETAILER',
        },
        phone_number: {
          $eq: retailerPhone,
        },
        ref_status: {
          $eq: ACTIVE_STATUS,
        },
      };
      const options = {
        new: true,
      };
      let update = { $set: { 'campaign.order_completed.status': true } };

      let subs = '';
      // if (updated) {
      //CHECK IF THE REFERRER IS RETAILER AND HAS BOUGHT SUBSCRIPTION
      if (refByRet.refByUserType === 'RETAILER') {
        // get shopId for the retailer
        console.log('Referrer of ret is a retailer');
        const retailer = await RMService.getShopDetails(refByRet.ref_by);
        const shopId = retailer.shop_id;
        console.log('Shop id: ', retailer);
        //check if subscription bought
        subs = await SubscriptionService.getSubscriptionbyShopId(shopId); //appName,shopId
        console.log('subs:  ', subs);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByRet, 'RETAILER');
        } else {
          //HOLD THE REWARDS
          console.log('No subscription. Hold the rewards');
          await WalletService.holdOrderRewardsToWallet(refByRet, 'RETAILER', refByRet.ref_by);
        }
      } else if (refByRet.refByUserType === 'LOGISTICS_DELIVERY') {
        console.log('Referrer of ret is a logistics');
        //write logic to check subscription bought or not
        let subs = await SubscriptionService.getLogisticSubscriptionByPhone(refByCust.refByPhone);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByRet, 'RETAILER');
        } else {
          await WalletService.holdOrderRewardsToWallet(refByRet, 'RETAILER', refByRet.ref_by);
        }
      } else if (refByRet.refByUserType.includes('EMPLOYEE')) {
        giveEmployeeReward(refByRet, retailerPhone);
      } else {
        //if INDIVIDUAL referred retailer then to give reward to INDIVIDUAL this retailer must have subscription
        //check if the reatailer has bought subscription
        subs = await ReferralsService.checkIfSubscribed(retailerPhone);
        console.log('subs is', subs);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByRet, 'RETAILER');
        } else {
          console.log('No subscription. Hold the rewards');
          await WalletService.holdOrderRewardsToWallet(refByRet, 'RETAILER', refByRet.ref_by);
        }
      }
      //rewards for manager, need understanding for this
      // check if manager of refBY is CO

      const updated = await ReferralsService.onStatusUpdate(filter, update, options);
    } else {
      console.log('Order conditions NOT done.');
    }
  } else {
    console.log('Order completed is already marked as true for this referral');
  }
};

const giveLogisticsReward = async (
  refByLogistics,
  customerPhone,
  retailerPhone,
  logisticsPhone
) => {
  //no need to check for 3 order condition here for logistics person here
  //as there is only single service and we can put that check in
  try {
    console.log('inside ref by logistics');
    if (!refByLogistics.campaign.order_completed.status) {
      // update the referral collection
      const filter = {
        type: {
          $eq: 'LOGISTICS_DELIVERY',
        },
        phone_number: {
          $eq: logisticsPhone,
        },
        ref_status: {
          $eq: ACTIVE_STATUS,
        },
      };
      const options = {
        new: true,
      };
      let update = { $set: { 'campaign.order_completed.status': true } };

      // if (updated) {
      //CHECK IF THE REFERRER IS RETAILER AND HAS BOUGHT SUBSCRIPTION
      if (refByLogistics.refByUserType === 'RETAILER') {
        console.log('Referrer of logistics is a retailer');
        // get shopId for the retailer
        const retailer = await RMService.getShopDetails(refByLogistics.ref_by);
        const shopId = retailer.shop_id;
        console.log('Shop id: ', shopId);
        //check if subscription bought
        const subs = await SubscriptionService.getSubscriptionbyShopId(shopId); //appName,shopId
        console.log(subs);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByLogistics, 'LOGISTICS_DELIVERY');
        } else {
          //HOLD THE REWARDS
          console.log('No subscription. Hold the rewards');
          await WalletService.holdOrderRewardsToWallet(
            refByLogistics,
            'LOGISTICS_DELIVERY',
            refByCust.ref_by
          );
        }
      } else if (refByLogistics.refByUserType === 'LOGISTICS_DELIVERY') {
        console.log('Referral of Logistics is Logistics Person');
        //write logic to check subscription bought or not
        let subs = await SubscriptionService.getLogisticSubscriptionByPhone(refByLogistics.phone);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByLogistics, 'LOGISTICS_DELIVERY');
        } else {
          console.log('No subscription. Hold the rewards');
          await WalletService.holdOrderRewardsToWallet(
            refByLogistics,
            'LOGISTICS_DELIVERY',
            refByLogistics.ref_by
          );
        }
      } else if (refByLogistics?.refByUserType?.includes('EMPLOYEE')) {
        giveEmployeeReward(refByLogistics, logisticsPhone);
      } else {
        //referre of LOGISTICS person is INDIVIDUAL
        //if this logistics person bought subscription then give reward to INDIVIDUAL
        console.log('Referral of Logistics is INDIVIDUAL');
        subs = await ReferralsService.checkIfSubscribed(logisticsPhone);
        console.log('subs is', subs);
        if (subs) {
          await WalletService.orderRewardsToWallet(refByLogistics, 'LOGISTICS_DELIVERY');
        } else {
          console.log('No subscription. Hold the rewards');
          await WalletService.holdOrderRewardsToWallet(
            refByLogistics,
            'LOGISTICS_DELIVERY',
            refByLogistics.ref_by
          );
        }
      }
      const updated = await ReferralsService.onStatusUpdate(filter, update, options);
      // } else {
      //   throw new REWARDS_COULD_NOT_BE_ADDED();
      // }
    }
  } catch (err) {
    throw err;
  }
};

const referreDetails = async (phone) => {
  log.info({ info: 'Refferal controller :: inside referral Details' });
  try {
    const data = await ReferralsService.getReferralDetails(phone);
    return data;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  invite,
  sendReminder,
  generateReferralCode,
  referral,
  onAcknowledgement,
  onSignup,
  onProfileCompletion,
  onFirstOrder,
  onRewardRecieved,
  onReferralExpired,
  onStatusUpdate,
  updateReferrerDetails,
  generateReport,
  onOrderComplete,
  updateRatings,
  referreDetails,
};
