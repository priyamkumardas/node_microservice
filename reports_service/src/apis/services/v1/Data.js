const mongoose = require('mongoose');

const Shop = require('@models/Shop');
const ShopMetaData = require('@models/ShopMetaData');

const {
  Logger: log,
} = require('sarvm-utility');

const getEmployees = async ({ startData, endDate }) => {
  log.info({info: 'Data Service :: Inside get Employees'})
  try {
    const db = mongoose.connection.useDb('ums');
    const data = await db.collection('employees').find({}).toArray();
    return data.map((item) => {
      return {
        __v: item.__v,
        _id: item._id,
        dateofJoining: item.dateofJoining,
        employeeId: item.employeeId,
        fullName: item.fullName,
        isActive: item.isActive,
        managerId: item.managerId,
        mobileNumber: item.mobileNumber,
        profilePhotoURL: item.profilePhotoURL,
        role: item.role,
        status: item.status,
        userId: item.userId,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const getSubscriptions = async ({ startData, endDate }) => {
  log.info({info: 'Data Service :: Inside get Subscriptions'})

  try {
    const db = mongoose.connection.useDb('sub');
    const data = await db
      .collection('subscription')
      .find({ paid: true, startDate: { $gte: new Date(startData) } })
      .toArray();
    return data.map((item) => {
      return {
        _class: item._class,
        _id: item._id,
        amount: item.amount,
        endDate: item.endDate,
        flyyUserId: item.flyyUserId,
        gst: item.gst,
        gstin: item.gstin,
        orderId: item.orderId,
        paid: item.paid,
        paymentId: item.paymentId,
        phone: item.phone,
        segmentId: item.segmentId,
        shopId: item.shopId,
        startDate: item.startDate,
        userId: item.userId,
        userType: item.userType,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const getReferral = async ({ startData, endDate }) => {
  log.info({info: 'Data Service :: Inside get Referral'})

  try {
    const db = mongoose.connection.useDb('ref_ms');
    const data = await db.collection('referrals').find({}).toArray();
    return data.map((item) => {
      return {
        __v: item.__v,
        _id: item._id,
        'campaign.ack': item.campaign.ack,
        'campaign.buy_subscription': item.campaign.buy_subscription,
        'campaign.kyc': item.campaign.kyc,
        'campaign.order_completed': item.campaign.order_completed,
        'campaign.profile_completion': item.campaign.profile_completion,
        'campaign.referral_reward': item.campaign.referral_reward,
        'campaign.signup': item.campaign.signup,
        createdAt: item.createdAt,
        phone_number: item.phone_number,
        refByFlyyUserId: item.refByFlyyUserId,
        refByPhone: item.refByPhone,
        refBySegmentId: item.refBySegmentId,
        refByUserType: item.refByUserType,
        ref_by: item.ref_by,
        ref_status: item.ref_status,
        reminder_count: item.reminder_count,
        type: item.reminder_count,
        updatedAt: item.updatedAt,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const getReward = async ({ startData, endDate }) => {
  log.info({info: 'Data Service :: Inside get Reward'})
  try {
    const db = mongoose.connection.useDb('ref_ms');
    const data = await db.collection('rewards').find({}).toArray();
    return data.map((item) => {
      return {
        _class: item._class,
        _id: item._id,
        amount: item.amount,
        eventName: item.eventName,
        eventType: item.eventType,
        refId: item.refId,
        referType: item.referType,
        status: item.status,
        'userDetails.flyyUserId': item.userDetails.flyyUserId,
        'userDetails.phoneNumber': item.userDetails.phoneNumber,
        'userDetails.segmentId': item.userDetails.segmentId,
        'userDetails.userId': item.userDetails.userId,
        'userDetails.userType': item.userDetails.userType,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const getUserData = async ({ startData, endDate }) => {
  log.info({info: 'Data Service :: Inside get UserData'})
  try {
    const db = mongoose.connection.useDb('ums');
    const data = await db.collection('users').find({}).toArray();
    return data.map((item) => {
      return {
        __v: item.__v,
        _id: item._id,
        'deliveryData.address': item.deliveryData.address,
        'deliveryData.isOtpVerified': item.deliveryData.isOtpVerified,
        'deliveryData.isProfileCompleted': item.deliveryData.isProfileCompleted,
        'deliveryData.userName': item.deliveryData.userName,
        flyyUserId: item.flyyUserId,
        'householdData.address': item.householdData.address,
        'householdData.isOtpVerified': item.householdData.isOtpVerified,
        'householdData.isProfileCompleted': item.householdData.isProfileCompleted,
        'householdData.userName': item.householdData.userName,
        phone: item.phone,
        referralCode: item.referralCode,
        'retailerData.address': item.retailerData.address,
        'retailerData.isOtpVerified': item.retailerData.isOtpVerified,
        'retailerData.isProfileCompleted': item.retailerData.isProfileCompleted,
        'retailerData.userName': item.retailerData.userName,
        userType: item.userType,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const getShop = async (startDate, endDate) => {
  log.info({info: 'Data Service :: Inside get Shop'})
  return await Shop.shopLists(startDate, endDate);
};

const getcatalogdata = async(shop_id)=>{

  return await ShopMetaData.getshopid(shop_id);
};

module.exports = {
  getEmployees,
  getSubscriptions,
  getReferral,
  getReward,
  getUserData,
  getShop,
  getcatalogdata,
};
