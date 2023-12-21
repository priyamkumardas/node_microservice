/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors');

class ShopItems extends Model {
  static get tableName() {
    return 'shop_item';
  }

  static async addItemsInShop(shopItemDetails) {
    try {
      const result = ShopItems.query().insert(shopItemDetails).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async listOfItemsInShop(shop_id) {
    try {
      const result = ShopItems.query().select('*').where('shop_id', '=', shop_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteShopItems(shop_id) {
    try {
      const result = ShopItems.query().delete().where('shop_id', '=', shop_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteOneProduct(shop_id, product_id) {
    try {
      const result = ShopItems.query().delete().where('shop_id', '=', shop_id).andWhere('peoduct_id', '=', product_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = ShopItems;
