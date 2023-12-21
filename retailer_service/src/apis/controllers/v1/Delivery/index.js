const { getShopOwnerDetails, getUserDetails } = require('@root/src/apis/services/v1/UserManagement');
const DeliveryBoyService = require('@services/v1/Delivery');
const UserService = require('@services/v1/UserManagement');
const { SHOP_USER, LOGISTIC_USER } = require('@constants')
const DELIVERYBOY_ALREADY_EXIST = require("@common/libs/ErrorHandler/DELIVERYBOY_ALREADY_EXIST")
const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log
} = require('sarvm-utility');
const { createUUID } = require('@root/src/common/libs/uuid/uuid4');

const addDeliveryBoyToShop = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside add delivery boy to shop' })
  try {
    const { shopId, userId, devliveryBoyId } = args;

    const body = {
      shopId: shopId.toString(),
      retailerId: userId,
      userId: devliveryBoyId,
    };
    const result = await DeliveryBoyService.addDeliveryBoyToShop(body);
    return result;
  } catch (error) {
    log.error({ error: error })
    return error;
  }
};

const getUserData = async (deliveryBoys) => {
  let lengthForPagination = deliveryBoys.length;
  let usersIds = deliveryBoys.map((item) => item.userId).join(';');
  const users = await getShopOwnerDetails(usersIds, lengthForPagination);
  return users
}

const createUserObj = (users) => {
  let user = users.map((item) => {
    const { _id, phone, basicInformation } = item
    let name = basicInformation?.personalDetails?.firstName || ''
    let profileImage = basicInformation?.personalDetails?.profileImage || ''
    return { _id, phone, name, profileImage };
  });
  return user
}

const getAllListOfAllDeliveryBoy = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside get all list of delivery boy' })
  try {
    const { shopId, userId } = args;

    const data = await DeliveryBoyService.getAllListOfAllDeliveryBoy();
    let retailerUser = await getUserDetails(userId);
    const { _id, phone, basicInformation } = retailerUser
    let self = [
      {
        _id,
        phone,
        name: 'Me',
        profileImage: basicInformation?.personalDetails?.profileImage || '',
      }
    ];
    const responseObj = {
      associated: [],
      freelancer: [],
      self: self,
    };

    if (data) {
      if (shopId) {
        let associated = [];
        let freelancer = [];
        for (const item of data) {
          if (item.shopId && item.shopId === String(shopId)) associated.push(item);
          if (item.userType == "FREELANCER" && item.shopId !== String(shopId)) freelancer.push(item);
        }
        if (associated && associated.length >= 1) {
          let associatedUsers = await getUserData(associated);
          const userInfo = createUserObj(associatedUsers)
          responseObj.associated = userInfo;
        }
        if (freelancer && freelancer.length >= 1) {
          const freelancerusers = await getUserData(freelancer);
          const userInfo = createUserObj(freelancerusers);
          responseObj.freelancer = userInfo;
        }
        return responseObj;
      }
      return {
        associated: responseObj.associated,
        self: responseObj.self,
        freelancer: responseObj.freelancer,
      };
    }
    return data;
  } catch (error) {
    throw new INTERNAL_SERVER_ERROR(error);
  }
};

const createDeliveryBoyForShop = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside create delivery boy for shop' })
  try {
    const { phone, firstName, lastName, role, salary, salaryType, profileImage, shopId, retailerId } = args;
    let user = await getUserDetails(phone);
    if (user) {
      throw new DELIVERYBOY_ALREADY_EXIST()
    }
    let uniqueId = createUUID().replace(/\D+/g, '').slice(0, 10)
    const deliveryBoyData = {
      shopId: `${shopId}`, retailerId, phone, role, salary, salaryType, userType: SHOP_USER, preference: "BIKE", uniqueId
    };

    const deliveryBoyUserData = { basicInformation: { personalDetails: { firstName, lastName, profileImage } }, phone, userType: LOGISTIC_USER, status: "ACTIVE" };

    deliveryBoyData.userId = await UserService.createUser(deliveryBoyUserData);

    let result = await DeliveryBoyService.createDeliveryBoy(deliveryBoyData);
    return result;
  } catch (error) {
    throw error;
  }
};
const sendUserInfoWithDeliveryBoy = async (data) => {
  log.info({ info: 'Retailer Controller :: Inside send user info with delivery boys' })
  let result = []
  if (data.length > 0) {
    for (const item of data) {
      const { userId } = item;
      const { basicInformation: { personalDetails }, phone, userType } = await UserService.getUserDetails(userId);
      item.user = { personalDetails, phone, userType }
      result.push(item);
    }
    return result
  }
  return result
}
const getAllDeliveryBoys = async (shopId) => {
  log.info({ info: 'Retailer Controller :: Inside get all delivery boys' })
  try {
    let DeliveryBoys = await DeliveryBoyService.getAllDeliveryBoys(shopId);
    let result = await sendUserInfoWithDeliveryBoy(DeliveryBoys)
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = { addDeliveryBoyToShop, getAllListOfAllDeliveryBoy, createDeliveryBoyForShop, getAllDeliveryBoys };
