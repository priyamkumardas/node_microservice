const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');
const ReferralsService = require('./Referral');
const UMService = require('./UMS');
const RewardService = require('./Reward');
const RMService = require('./RMS');
const CASHBACK_AMOUNT = 399;
const RETAILER_CASHBACK_AMOUNT = 499;
const LOGISTICS_CASHBACK_AMOUNT = 499;
const SUBS_RENEWAL_AMOUNT_SSO = 50;
const SUBS_RENEWAL_AMOUNT_CO = 12;
const segmentIdMapper = {
  EMPLOYEE_SH: 'sales_employee_sh',
  EMPLOYEE_SSO: 'sales_employee_sso',
  EMPLOYEE_CO: 'sales_employee_co',
};
const orderRewardsToWallet = async (user, type) => {
  let data = {
    userDetails: {
      phoneNumber: user.refByPhone,
      userId: user.ref_by,
      userType: user.refByUserType,
      segmentId: user.refBySegmentId,
      flyyUserId: user.refByFlyyUserId,
    },
    refId: user._id,
    referType: type,
    isReferrer: true,
    eventName: 'order_completed',
    eventType: 'REWARD',
    amount: user.campaign.order_completed.rewardAmount,
  };
  log.info({ info: 'wallet service :: inside order Rewards to wallet' });
  try {
    const isInsertionValid = await RewardService.isInsertionValid(
      user.refId,
      'REWARD',
      type,
      'order_completed'
    );
    if (isInsertionValid) {
      const result = await RewardService.insert(data);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const holdOrderRewardsToWallet = async (user, type, retailerId) => {
  let data = {
    userDetails: {
      phoneNumber: user.refByPhone,
      userId: user.ref_by,
      userType: user.refByUserType,
      segmentId: user.refBySegmentId,
      flyyUserId: user.refByFlyyUserId,
    },
    refId: user._id,
    referType: type,
    isReferrer: true,
    eventName: 'order_completed',
    eventType: 'REWARD',
    amount: user.campaign.order_completed.rewardAmount,
    retailerId: retailerId,
  };
  try {
    const isInsertionValid = await RewardService.isInsertionValidToHoldRewards(
      user.refId,
      'REWARD',
      type,
      'order_completed'
    );
    if (isInsertionValid) {
      const result = await RewardService.insertToHoldRewards(data);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const orderCORewardsToWallet = async (refId, type, empObj) => {
  let data = {
    userDetails: empObj,
    refId: refId,
    referType: type,
    isReferrer: false,
    eventName: 'order_completed',
    eventType: 'REWARD',
    amount: 16,
  };
  try {
    const isInsertionValid = await RewardService.isInsertionValid(
      refId,
      'REWARD',
      type,
      'order_completed',
      empObj.userId
    );
    if (isInsertionValid) {
      const result = await RewardService.insert(data);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const holdOrderCORewardsToWallet = async (refId, type, empObj, retailerId) => {
  let data = {
    userDetails: empObj,
    refId: refId,
    referType: type,
    isReferrer: false,
    eventName: 'order_completed',
    eventType: 'REWARD',
    amount: 16,
    retailerId: retailerId,
  };
  try {
    const isInsertionValid = await RewardService.isInsertionValidToHoldRewards(
      refId,
      'REWARD',
      type,
      'order_completed',
      empObj.userId
    );
    if (isInsertionValid) {
      const result = await RewardService.insertToHoldRewards(data);
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};
const sendUserDetailsToWallet = async (userId, type, phone, stage, segmentId, flyyUserId) => {
  // send API for reward
  console.log('user id is', userId, type, phone, stage, segmentId, flyyUserId);
  let referral = {};
  try {
    referral = await ReferralsService.getReferralDetails(phone);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
  // console.log("referral is", referral)
  let refId = referral._id;
  console.log('referral is', referral);
  console.log(referral['campaign'][stage]['status']);
  if (!referral['campaign'][stage]['status']) {
    if (referral['campaign'][stage]['reward']) {
      //get username from ref collection
      let { ref_by, refByPhone, refByUserType, refByFlyyUserId, refBySegmentId } = referral;
      let data = {
        userDetails: {
          phoneNumber: refByPhone,
          userId: ref_by,
          userType: refByUserType,
          segmentId: refBySegmentId,
          flyyUserId: refByFlyyUserId,
        },
        refId: refId,
        referType: type,
        isReferrer: true,
        eventName: stage,
        eventType: 'REWARD',
        amount: referral['campaign'][stage]['rewardAmount'],
      };

      try {
        const isInsertionValid = await RewardService.isInsertionValid(
          refId,
          'REWARD',
          type,
          stage,
          ref_by
        );
        if (isInsertionValid) {
          const result = await RewardService.insert(data);
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
    if (referral['campaign'][stage]['cashback']) {
      let data = {
        userDetails: {
          phoneNumber: phone,
          userId: userId,
          userType: type,
          segmentId: segmentId,
          flyyUserId: flyyUserId,
        },
        refId: refId,
        referType: type,
        isReferrer: false,
        eventName: stage,
        eventType: 'CASHBACK',
        amount: referral['campaign'][stage]['cashbackAmount'],
      };

      try {
        const isInsertionValid = await RewardService.isInsertionValid(
          refId,
          'CASHBACK',
          type,
          stage,
          userId
        );
        if (isInsertionValid) {
          const result = await RewardService.insert(data);
        }
        // const result = await RewardService.insert(data);
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
  }
};

const sendCashback = async (userId, type, phone, stage, segmentId, flyyUserId) => {
  let amount = 0;
  if (type === 'INDIVIDUAL') {
    amount = CASHBACK_AMOUNT;
  } else if (type === 'RETAILER') {
    amount = RETAILER_CASHBACK_AMOUNT;
  } else if (type === 'LOGISTICS_DELIVERY') {
    amount = LOGISTICS_CASHBACK_AMOUNT;
  }
  let data = {
    userDetails: {
      phoneNumber: phone,
      userId: userId,
      userType: type,
      segmentId: segmentId,
      flyyUserId: flyyUserId,
    },
    refId: 'NAN',
    referType: 'NAN',
    isReferrer: false,
    eventName: stage,
    eventType: 'CASHBACK',
    amount: amount,
  };
  log.info({ info: 'wallet service :: inside send cashback' });
  try {
    const isCashbackValid = await RewardService.isCashbackValid(phone, 'CASHBACK', stage);
    if (isCashbackValid) {
      const result = await RewardService.insert(data);
    }
    // const result = await RewardService.insert(data);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const sendSubscriptionRenewalReward = async (refId, userId, type, phone, stage) => {
  // send API for reward
  let manager = {};
  log.info({ info: 'wallet service :: inside send and subscription Renewal reward' });
  try {
    const retailer = await RMService.getShopDetails(userId);
    manager = await RMService.getManagerOfRetailer(retailer.shop_id);
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }

  //in case of future subs renewal of logistics, just put a if else check and perform the same steps from 298 to 303;

  if (manager) {
    let data = {
      userDetails: {
        phoneNumber: manager.phone,
        userId: manager._id,
        userType: manager.userType,
        segmentId: segmentIdMapper[manager.userType],
        flyyUserId: manager.flyyUserId,
      },
      refId: 'NAN',
      referType: 'NAN',
      isReferrer: false,
      eventName: stage,
      eventType: 'REWARD',
      amount: SUBS_RENEWAL_AMOUNT_SSO,
    };
    try {
      const isInsertionValid = await RewardService.isInsertionValid(
        refId,
        'REWARD',
        type,
        stage,
        manager._id
      );
      if (isInsertionValid) {
        const result = await RewardService.insert(data);
      }
    } catch (err) {
      console.log(err);
      throw new Error(err);
    }

    // if manager of employee is a CO send commission
    const emp = await UMService.getEmployeeDetails(manager.phone);
    manager = await UMService.getEmployeeDetails(emp.managerId);
    if (manager.role === 'CO') {
      const refByCO = await UMService.getUserDetails(manager.userId, 'householdApp');
      let data = {
        userDetails: {
          phoneNumber: refByCO.phone,
          userId: refByCO._id,
          userType: refByCO.userType,
          segmentId: segmentIdMapper[refByCO.userType],
          flyyUserId: refByCO.flyyUserId,
        },
        refId: refId,
        referType: type,
        isReferrer: false,
        eventName: stage,
        eventType: 'CASHBACK',
        amount: SUBS_RENEWAL_AMOUNT_CO,
      };

      try {
        const isInsertionValid = await RewardService.isInsertionValid(
          refId,
          'CASHBACK',
          type,
          stage,
          refByCO._id
        );
        if (isInsertionValid) {
          const result = await RewardService.insert(data);
        }
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    }
  }
};

module.exports = {
  sendUserDetailsToWallet,
  orderRewardsToWallet,
  orderCORewardsToWallet,
  sendCashback,
  holdOrderRewardsToWallet,
  holdOrderCORewardsToWallet,
  sendSubscriptionRenewalReward,
};
