const {
  RequestHandler,
  ErrorHandler: { INTERNAL_SERVER_ERROR },Logger:log
} = require("sarvm-utility");
let referralCodes = require("referral-codes");

let { Referral } = require("@root/src/apis/models/Referral");
let { Reward } = require("@root/src/apis/models/Reward");
let { Order } = require("@root/src/apis/models/Order");
const { inviteLimit } = require("@root/src/config");
const {
  SEND_INVITE_ERROR,
  DUPLICATE_KEY_ERROR,
  REMINDER_COUNT_UPDATE_ERROR,
  SEND_REMINDER_ERROR,
  REMINDER_COUNT_READ_ERROR,
  REFERRAL_UPDATE_ERROR,
  REFERRAL_READ_ERROR,
  REFERRAL_STATUS_UPDATE_ERROR,
  STORY_READ_ERROR,
  DUPLICATE_ORDER_ID_ERROR,
  RATINGS_UPDATE_ERROR,
} = require("@root/src/apis/errors");
const { getUserId } = require("./UMS");
const { getAllOrderByUserId, getAllOrderByRetailerId, getTripDetailsByDeliveryBoyId } = require("./OMS");



const invite = async (ref_code, phoneNumber) => {
  //Send Invite to the user
  try {
    return true;
  } catch (err) {
    throw new SEND_INVITE_ERROR();
  }
};

const generateReferralCode = async (userId, userName) => {
  log.info({info:'Referral Service :: inside generate Referral Code'});
  try {
    // console.log(userId);
    // console.log(userName);
    let prefix = "SARVM-";
    prefix = prefix.concat(userId.concat("-".concat(userName)));
    let referralCode = referralCodes.generate({
      length: 8,
      count: 1,
      prefix: prefix,
    });

    let data = { referralCode: referralCode };
    return data;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

const sendReminder = async (userId, phoneNumber) => {
  try {
    console.log(userId);
    console.log(phoneNumber);
    return true;
  } catch (err) {
    throw new SEND_REMINDER_ERROR();
  }
};

const getReminderCount = async (ref_by, type, phoneNumber, refStatus) => {
  log.info({info:'Refferal service :: inside get Reminder Count'});
  try {
    let reminder_count = await Referral.find({
      ref_by: ref_by,
      type: type,
      phone_number: phoneNumber,
      ref_status: refStatus,
    });
    console.log(reminder_count);
    return reminder_count[0].reminder_count;
  } catch (error) {
    throw new REMINDER_COUNT_READ_ERROR();
  }
};

const create = async (data) => {
  try {
    let user = new Referral(data);
    // Referral.create
    let result = await user.save();
    console.log("Insert Result: ", result);
    return true;
  } catch (err) {
    if (err.code === 11000) {
      throw new DUPLICATE_KEY_ERROR();
    }
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

const read = async (ref_by,refByUserType) => {
  try {
    
    const fields = {
      type: 1,
      phone_number: 1,
      campaign: 1,
      ratings:1,
      comments: 1,
      createdAt: 1,
    };
    
    const data = await Referral.find({ ref_by: ref_by , refByUserType:{$in :  refByUserType } } )
    .lean().select(fields).sort({createdAt: -1});
    
    return data;
  } catch (err) {
    throw new REFERRAL_READ_ERROR();
  }
};

const updateRatings = async (filter, update, options) => {
  log.info({info: 'Refferal service :: inside update Rating'});
  try {
    const updated = await Referral.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();
    if (updated == null) {
      throw new RATINGS_UPDATE_ERROR();
    }
  } catch (err) {
    console.log("error is", err);
    if (err.key === "ref_ms") {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

// Update Transfer refrel
const updateTransfer = async (filter, update, options) => {
  try {
    const updated = await Referral.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();
    console.log(updated);
    if (updated == null) {
      throw new REFERRAL_UPDATE_ERROR();
    }
  } catch (err) {
    if (err.key === "ref_ms") {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};
const onStatusUpdate = async (filter, update, options) => {
  try {
    const updated = await Referral.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();
    if (updated == null) {
      throw new REFERRAL_UPDATE_ERROR();
    }
    return true;
  } catch (err) {
    if (err.key === "ref_ms") {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};
const update = async (type, phone_number, update) => {
  try {
    const filter = { type: { $eq: type }, phone_number: { $eq: phone_number } };
    const options = { new: true };
    const updated = await Referral.findOneAndUpdate(
      filter,
      update,
      options
    ).exec();
    if (updated == null) {
      throw new REFERRAL_UPDATE_ERROR();
    }
    return true;
  } catch (err) {
    if (err.key === "ref_ms") {
      throw err;
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const updateRewardsRecieved = async (ref_code) => {
  try {
    const filter = { ref_by: { $eq: ref_code } };
    const update = { $inc: { rewards_recieved: 1 } };
    const options = {
      new: true,
      upsert: true,
    };
    const updated = await Reward.findOneAndUpdate(filter, update, options);
    if (updated == null) {
      return {
        status: false,
        errorObj: {
          code: "REWARD_COLLECTION_UPDATE_ERROR",
          message: "REWARD collection could not be updated",
        },
      };
    }
    return { status: true };
  } catch (err) {
    return {
      status: false,
      errorObj: {
        code: "REWARD_COLLECTION_UPDATE_ERROR",
        message: "REWARD collection could not be updated",
      },
    };
  }
};

const remove = async (phone_number) => {
  try {
    Referral.findOneAndDelete(
      {
        phone_number: phone_number,
      },
      (err, docs) => {
        if (err) {
          console.log(err);
          return err;
        }
      }
    );
    return;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};

const getReferralDetails = async (phone) => {
  log.info({info: 'Referral service :: inside get Referral details'});
  try {
    let data = await Referral.findOne({ phone_number: phone });
    return data;
  } catch (err) {
    throw new INTERNAL_SERVER_ERROR(err);
  }
};
const checkSentInvites = async (ref_by) => {
  // Sent Invites = Num of Users invited - Num of users ack
  log.info({info:'Refferal Service :: inside invite sent'});
  let data = await read(ref_by);
  return getNumUsersInvited(data) - getNumAcknowledged(data);
};

const calcPercent = (val1, val2) => {
  console.log(val1);
  console.log(val2);
  return parseFloat(((val1 / val2) * 100).toFixed(2));
};
const getPercentUsersInvited = (users) => {
  log.info({info:'Refferal service :: inside get percent user Invited users'});
  const numUsersInvited = getNumUsersInvited(users);
  const numAcknowledged = getNumAcknowledged(users);
  if (numUsersInvited > 0) {
    const percentUsersInvited = calcPercent(
      numUsersInvited - numAcknowledged,
      inviteLimit
    );
    return percentUsersInvited;
  }
  return 0;
};

const getPercentAcknowledged = (users) => {
  const numUsersInvited = getNumUsersInvited(users);
  const numAcknowledged = getNumAcknowledged(users);
  if (numUsersInvited > 0) {
    const getPercentAcknowledged = calcPercent(
      numUsersInvited,
      numAcknowledged
    );
    return getPercentAcknowledged;
  }
  return 0;
};

const getPercentSignedup = (users) => {
  const numUsersInvited = getNumUsersInvited(users);
  const numSignedup = getNumSignedup(users);
  if (numUsersInvited > 0) {
    const percentUsersSignedup = calcPercent(numSignedup, numUsersInvited);
    return percentUsersSignedup;
  }
  return 0;
};

const getPercentProfileCompleted = (users) => {
  const numUsersInvited = getNumUsersInvited(users);
  const numProfileCompleted = getNumProfileCompleted(users);
  if (numUsersInvited > 0) {
    const percentProfileCompleted = calcPercent(
      numProfileCompleted,
      numUsersInvited
    );
    return percentProfileCompleted;
  }
  return 0;
};

const getPercentFirstOrderCompleted = (users) => {
  const numUsersInvited = getNumUsersInvited(users);
  const numFirstOrderCompleted = getNumFirstOrderCompleted(users);
  if (numUsersInvited > 0) {
    const percentFirstOrderCompleted = calcPercent(
      numFirstOrderCompleted,
      numUsersInvited
    );
    return percentFirstOrderCompleted;
  }
  return 0;
};

const getPercentRewardRecieved = (users) => {
  const numUsersInvited = getNumUsersInvited(users);
  const numRewardRecieved = getNumRewardRecieved(users);
  if (numUsersInvited > 0) {
    const percentRewardRecieved = calcPercent(
      numRewardRecieved,
      numUsersInvited
    );
    return percentRewardRecieved;
  }
  return 0;
};

const getNumUsersInvited = (users) => {
  // Num of users invited would be the total number of objects in the user array data
  return users.length;
};

const getNumAcknowledged = (users) => {
  let ack_count = 0;
  users.forEach((user) => {
    
    if (user.campaign.ack.status == true) {
      ack_count = ack_count + 1;
    }
  });
  return ack_count;
};

const getNumSignedup = (users) => {
  let signup_count = 0;
  users.forEach((user) => {
    if (user.signup_status == true) {
      signup_count = signup_count + 1;
    }
  });
  return signup_count;
};

const getNumProfileCompleted = (users) => {
  let prof_complete_count = 0;
  users.forEach((user) => {
    if (user.profile_completion_status == true) {
      prof_complete_count = prof_complete_count + 1;
    }
  });
  return prof_complete_count;
};

const getNumFirstOrderCompleted = (users) => {
  let first_order_complete_count = 0;
  users.forEach((user) => {
    if (user.first_order_status == true) {
      first_order_complete_count = first_order_complete_count + 1;
    }
  });
  return first_order_complete_count;
};
const getNumRewardRecieved = (users) => {
  let referral_reward_count = 0;
  users.forEach((user) => {
    if (user.referral_reward_status == true) {
      referral_reward_count = referral_reward_count + 1;
    }
  });
  return referral_reward_count;
};

const getTotalRewardRecieved = async (ref_code) => {
  let reward_recieved = await Reward.find({ ref_by: ref_code });
  if (reward_recieved.length > 0) {
    return reward_recieved[0].rewards_recieved;
  }
  return 0;
};

const updateReminderCount = async (ref_by, type, phone_number) => {
  try {
    const filter = {
      ref_by: { $eq: ref_by },
      type: type,
      phone_number: { $eq: phone_number },
    };
    const update = { $inc: { reminder_count: 1 } };
    const options = {
      new: true,
    };
    const callback = (err, docs) => {
      if (err) {
        throw err;
      }
      console.log("Update: ", docs);
    };
    Referral.findOneAndUpdate(filter, update, options, callback);
    return true;
  } catch (err) {
    throw new REMINDER_COUNT_UPDATE_ERROR();
  }
};

const test = async (phone) => {
  console.log("phone", phone);
};
const checkIfReferralActive = async (type, phoneNumber, ACTIVE_STATUS) => {
  try {
    const filter = {
      type: { $eq: type },
      phone_number: { $eq: phoneNumber },
      ref_status: { $eq: ACTIVE_STATUS },
    };
    const count = await Referral.countDocuments(filter);
    if (count > 0) {
      return true;
    }
    return false;
  } catch (err) {
    throw new REFERRAL_READ_ERROR();
  }
};

const setRefStatusExpired = async (date, expired_status) => {
  log.info({info:'Refferal service :: inside set Refferal status expired'});
  try {
    const filter = {
      created_at: { $lt: date },
    };
    const update = { $set: { ref_status: expired_status } };
    const options = {
      new: true,
    };
    const updated = await Referral.updateMany(filter, update, options);
    console.log("Updated: ", updated);
    if (updated == undefined) {
      throw REFERRAL_STATUS_UPDATE_ERROR();
    }
    return true;
  } catch (err) {
    console.log(err);
    throw new REFERRAL_STATUS_UPDATE_ERROR();
  }
};

const getLatestReferralType = async (phoneNumber, refStatus) => {
  try {
    let docs = await Referral.find({
      phone_number: phoneNumber,
      ref_status: refStatus,
    });
    let type = "";
    if (docs.length == 1) {
      console.log("only one record");
      type = docs[0]["type"];
      console.log(type);
      // return type
    } else if (docs.length == 2) {
      console.log("2 records found");
      let created_dateTime = docs[0]["createdAt"];
      console.log(created_dateTime);
      if (created_dateTime > docs[1]["createdAt"]) {
        console.log("1st");
        type = docs[0]["type"];
        // return type
      } else {
        console.log("2nd");
        type = docs[1]["type"];
        console.log(type);
      }
    }
    console.log(type);
    return type;
  } catch (error) {
    throw new REMINDER_COUNT_READ_ERROR();
  }
};

const getReferrer = async (phone, type) => {
  log.info({info:'Refferal service :: inside get Referrer'});
  const refBy = await Referral.find({ phone_number: phone, type: type });
  if (refBy.length) {
    return refBy[0];
  } else {
    return null;
  }
};

const createOrder = async (retailerPhone, amount, order_id) => {
  console.log(order_id);
  const orderObj = {
    retailerPhone: retailerPhone,
    amount: amount,
    order_id: order_id,
  };
  try {
    await Order.create(orderObj);
  } catch (err) {
    if (err.code === 11000) {
      // change to duplicate order id
      throw new DUPLICATE_ORDER_ID_ERROR();
    } else {
      throw new INTERNAL_SERVER_ERROR(err);
    }
  }
};

const getOrders = async (retailerPhone) => {
  const orders = await Order.find({ retailerPhone: retailerPhone });
  return orders;
};

const getCustomerOrders = async (customerPhone) => {
  const orders = await Order.find({ customerPhone: customerPhone });
  return orders.length;
};

const getOrderCountByPhoneNumber = async (phone_number, type) => {
  
    //call ums api to get user details using phone number
    try {
      let userId = await getUserId(phone_number);
      //get order details using userId
      if(userId === null) {
        return []
      } else {
        let orders = null;
        if(type === 'INDIVIDUAL') {
          orders = await getAllOrderByUserId(userId)
        } else if(type === 'RETAILER') {
          //write call for get orders by retailer Id
          orders = await getAllOrderByRetailerId(userId)
        } else if(type === 'LOGISTICS_DELIVERY') {
          //orders = await getTripDetailsByDeliveryBoyId(userId) 
        }

        return orders;
      }

    } catch (error) {
      console.log(error);
    }

    //call oms api to get total orders by userId
  return true;
};


const checkIfSubscribed = async (phone_number) => {
  const referral = await Referral.find({ phone_number: phone_number });
  if(referral[0].campaign?.buy_subscription.status) {
    return true;
  } else {
    return false;
  }
  // if (referral[0].campaign?.order_completed?.status) {
  //   return true;
  // } else {
  //   return false;
  // }
};
module.exports = {
  invite,
  generateReferralCode,
  sendReminder,

  create,
  read,
  update,
  remove,

  checkSentInvites,

  getPercentUsersInvited,
  getPercentAcknowledged,
  getPercentProfileCompleted,
  getPercentSignedup,
  getPercentFirstOrderCompleted,
  getPercentRewardRecieved,

  getTotalRewardRecieved,

  updateRewardsRecieved,
  getReminderCount,
  updateReminderCount,

  // check_if_reg,
  checkIfReferralActive,
  setRefStatusExpired,
  onStatusUpdate,
  updateRatings,
  getLatestReferralType,
  getReferralDetails,
  test,
  getReferrer,
  createOrder,
  getOrders,

  checkIfSubscribed,

  updateTransfer,
  getCustomerOrders,
  getOrderCountByPhoneNumber,
};
