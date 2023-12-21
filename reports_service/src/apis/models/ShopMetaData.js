/* eslint-disable max-len */
/* eslint-disable camelcase */
const { Model } = require('objection');

const { DATA_BASE_ERROR } = require('../errors');

class ShopMetaData extends Model {
  static get tableName() {
    return 'store_meta_data';
  }

  static async addMetaData(shop_id, categories, key) {
    try {
      const result = await this.getMetaData(shop_id);
      const object = {
        shop_id,
        categories: JSON.stringify(categories),
        version: 1,
        url: key,
        active: true,
      };
      if (result.length === 0) {
        const insertData = await this.addMetaDataToDataBase(object);
        return insertData;
      }
      if (result.length >= 1) {
        const previosMetaData = result[0];
        await this.removeAllAvailableData(shop_id, previosMetaData.version, false);
        let response = await this.updateMetaData(object, shop_id);
        return response;
      }
      return false;
    } catch (error) {
      console.log(error);
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async removeAllAvailableData(shop_id, version, active) {
    try {
      const result = await ShopMetaData.query()
        .delete()
        .where('shop_id', '=', shop_id)
        .andWhere('active', '=', false);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async addMetaDataToDataBase(metaDataDetails) {
    try {
      const result = await ShopMetaData.query().insert(metaDataDetails).returning('*').first();
      return result;
    } catch (error) {
      console.log(error);
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getMetaData(shop_id) {
    try {
      const result = await ShopMetaData.query()
        .select('*')
        .where('shop_id', '=', shop_id)
        .andWhere('active', '=', true)
        .orderBy('version', 'desc');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getAllCatalogMetaData() {
    try {
      const result = await ShopMetaData.query()
        .select('*')
        .andWhere('active', '=', true)
        .orderBy('version', 'desc');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getAllMetaData(shopIds) {
    try {
      const result = await ShopMetaData.query()
        .select('*')
        .whereIn('shop_id', shopIds)
        .andWhere('active', '=', true)
        .orderBy('version', 'desc');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateMetaData(args, shop_id) {
    try {
      const result = await ShopMetaData.query()
        .update(args)
        .where('shop_id', '=', shop_id)
        .andWhere('active', '=', true);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async getshopid(shop_id) {
    try {
      const result = await ShopMetaData.query().select('*').where('shop_id', '=', shop_id);
      const data = typeof result === 'undefined' ? null : result;

      return data;
    } catch (error) {
      console.log(error);
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async getshopids() {
    try {
      // const result = await ShopMetaData.query()
      // .select('*')
      // .whereIn('shop_id', shop_id)
      // return result;

      const result = await ShopMetaData.query().select('*');
      const data = typeof result === 'undefined' ? null : result;

      return data;
    } catch (error) {
      console.log(error);
      // throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = ShopMetaData;
