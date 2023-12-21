/* eslint-disable camelcase */
/* eslint-disable import/no-unresolved */
const ShopService = require('@services/v1/Shop');
const UserManagement = require('@services/v1/UserManagement');

const {
  ErrorHandler: { INTERNAL_SERVER_ERROR },
  Logger: log,
} = require('sarvm-utility');
const { SHOP_NOT_FOUND_ERROR } = require('@errors');
const { SHOP_ALREADY_EXIST } = require('../../../common/libs/ErrorHandler');
const { bizBaseUrl } = require('@config');

const getProfileUrl = (shopId) => `/shops/${shopId}`;

const showShopDetailsByShopId = async (args) => {
  log.info({ info: 'Retailer Controller :: Inside show shop details by shop id' });
  try {
    const { shopId } = args;
    let shopDetails = await ShopService.showShopDetailsByShopId(shopId);
    shopDetails[0].gst_no = shopDetails.GST_no == null ? false : true;
    shopDetails[0].profileUrl = `${bizBaseUrl}${getProfileUrl(shopDetails[0].guid)}`;
    const subscriptionDetails = await ShopService.getShopSubscriptionData(shopId);
    let manager_id = shopDetails[0].manager_id;
    let managerDetail = {};
    if (manager_id !== null) {
      managerDetail = await UserManagement.getUserDetails(manager_id);
    }
    const shop = Object.assign({}, ...shopDetails);
    return { shop, subscriptionDetails, managerDetail };
  } catch (error) {
    if (error.key === 'rms') {
      throw error;
    } else {
      throw new INTERNAL_SERVER_ERROR(error);
    }
  }
};

module.exports = {
  showShopDetailsByShopId,
};
