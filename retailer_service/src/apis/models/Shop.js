/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR, SHOP_NOT_FOUND_ERROR } = require('../errors');

const config = require('../../config');
const { COLUMNS } = require('../../constants/dbConstants');
const { makeId } = require('../../common/utility/utils');
const { Logger } = require('sarvm-utility');
const { createUUID } = require('@root/src/common/libs/uuid/uuid4');
const Retailer = require('./Retailer');
const ShopMetaData = require('./ShopMetaData');
const axios = require('axios');

const { sendSqsMessage } = require('@root/src/apis/producers/sqsProducer');

class Shop extends Model {
  static get tableName() {
    return 'shop';
  }

  static async getUniqueId() {
    try {
      let uniqueId = null;
      let rows = 0;
      do {
        uniqueId = makeId(config.UNIQUE_SHOP_ID_TYPE);
        rows = await Shop.query().select(COLUMNS.SHOP.ID).where(COLUMNS.SHOP.ID, '=', uniqueId);
      } while (rows.length > 0);
      return uniqueId;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getShopDetailsByUserId({ userId }) {
    try {
      const result = await Shop.query().select('*').where('user_id', '=', `${userId}`);
      if (result.length === 0) {
        Logger.warn({ warn: ' SHOP_NOT_FOUND_ERROR' });
        throw new SHOP_NOT_FOUND_ERROR();
      }
      return result[0];
    } catch (error) {
      if (error.key === 'rms') {
        throw error;
      } else {
        Logger.error({ error: error });
        throw new DATA_BASE_ERROR(error);
      }
    }
  }

  // static async updateShop() {
  //   try {
  //     const result = await Shop.query().patch(data).where('shop_id', '=', shop_id).returning('*');
  //     return result;
  //   } catch (error) {
  //     throw new DATA_BASE_ERROR(error);
  //   }
  // }
  static async createRetailer(retailerDetails) {
    try {
      const result = await Retailer.query().insert(retailerDetails).returning('*');
      Logger.info({ info: 'insert data in retailer databses' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async shopCount() {
    try {
      const totalCount = await Shop.query().resultSize();
      return totalCount;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async addShop(shopDetails) {
    try {
      const result = await Shop.query().insert(shopDetails).returning('*');
      Logger.info({ info: 'insert data in databses' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async shopListByRetailerId(user_id) {
    try {
      const result = await Shop.query().select('*').where('user_id', '=', user_id);
      Logger.info({ info: 'data return' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateShopDetails(data, shop_id) {
    try {
      sendSqsMessage({
        eventType: 'UPSERT_EVENT_SQS',
        data: {
          body: {
            shopId: shop_id,
            data,
          },
        },
      });
      const result = await Shop.query().patch(data).where('shop_id', '=', shop_id).returning('*');
      Logger.info({ info: 'update data in databses' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async shopLists(limit = 10, offset = 0, shop_id, pincode, city, shopName) {
    try {
      const result = await Shop.query()
        .page(offset, limit)
        .modify((queryBuilder) => {
          if (city && city != null && city != '') {
            queryBuilder.where('city', 'ilike', `%${city}%`);
          }
          if (pincode && pincode != null && pincode != '') {
            queryBuilder.where('pincode', '=', pincode);
          }
          if (shop_id && shop_id != null && shop_id != '') {
            queryBuilder.where('shop_id', '=', shop_id);
          }
          if (shopName && shopName != null && shopName != '') {
            queryBuilder.where('shop_name', 'ilike', `%${shopName}%`);
          }
        });
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteShop(shop_id) {
    try {
      const result = await Shop.query().delete().where('shop_id', '=', shop_id);
      Logger.info({ info: 'delete data in databses' });
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  // static async showShopDetailsByShopId(shop_id) {
  //   Logger.info({ info: 'get shop data' });

  //   try {
  //     const result = await Shop.query().select('*').where('shop_id', '=', shop_id);
  //     const shopMetaData = await ShopMetaData.query().select('url').where('shop_id', '=', shop_id);
  //     const catalog_url = shopMetaData[0].url;
  //     if (catalog_url != null) {
  //       let catalog_data = await axios.get(catalog_url);
  //       catalog_data = catalog_data.data.catalog;

  //       const shopCategory = catalog_data.map((catalog) => {
  //         return {
  //           name: catalog.name,
  //           image: catalog.image,
  //         };
  //       });

  //       result[0]['category'] = shopCategory;
  //     }

  //     return result;
  //   } catch (error) {
  //     Logger.info({ error: error });
  //     throw new DATA_BASE_ERROR(error);
  //   }
  // }

  static async showShopDetailsByShopId(shop_id) {
    try {
      Logger.info({ info: 'get shop data' });

      const result = await Shop.query().select('*').where('shop_id', '=', shop_id);

      const shopMetaData = await ShopMetaData.query().select('url').where('shop_id', '=', shop_id);

      if (shopMetaData.length === 0 || !shopMetaData[0].url) {
        return result;
      }

      const catalog_url = shopMetaData[0].url;
      const catalog_data = await axios.get(catalog_url).then((response) => response.data.catalog);

      const shopCategory = catalog_data.map((catalog) => ({
        name: catalog.name,
        image: catalog.image,
      }));

      result[0].category = shopCategory;

      return result;
    } catch (error) {
      Logger.info({ error: error });
      throw new DATABASE_ERROR(error);
    }
  }

  static async subscriptionStatus(shop_id, isSubscribed) {
    try {
      const result = await Shop.query().update({ isSubscribed }).where('shop_id', '=', shop_id);
      Logger.info({ info: 'update subscription status in databses' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async kycStatus(shop_id, isKYCVerified) {
    try {
      const result = await Shop.query().update({ isKYCVerified }).where('shop_id', '=', shop_id);
      Logger.info({ info: 'kyc updated' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateGstNumber(shop_id, GST_no) {
    try {
      const result = await Shop.query().update({ GST_no }).where('shop_id', '=', shop_id);
      Logger.info({ info: 'GST no updated' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getGstNumber(shop_id) {
    try {
      const result = await Shop.query().select('GST_no').where('shop_id', '=', shop_id);
      Logger.info({ info: 'get GST no' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async findShop(shop_id) {
    try {
      console.log(shop_id);
      const result = await Shop.query().select('*').where('shop_id', '=', shop_id);
      if (result.length === 0) {
        Logger.warn({ warn: 'shop not found' });
        throw new SHOP_NOT_FOUND_ERROR();
      }
      return result;
    } catch (error) {
      if (error.key === 'rms') {
        throw error;
      } else {
        throw new DATA_BASE_ERROR(error);
      }
    }
  }

  static async showShopDetailsByUniqueId(id) {
    console.log('id is', id);
    try {
      const result = await Shop.query().select('*').where('guid', '=', id);
      console.log(result);
      if (result.length === 0) {
        Logger.warn({ warn: 'shop not found' });
        throw new SHOP_NOT_FOUND_ERROR();
      }
      return result;
    } catch (error) {
      console.log('error is', error);
      if (error.key === 'rms') {
        throw error;
      } else {
        throw new DATA_BASE_ERROR(error);
      }
    }
  }

  static async updateShopStatus(shop_id, shop_status) {
    try {
      const result = await Shop.query().update({ shop_status }).where('shop_id', '=', shop_id);
      Logger.info({ info: 'shop status updated' });
      return result;
    } catch (error) {
      Logger.error({ error: error });
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = Shop;
