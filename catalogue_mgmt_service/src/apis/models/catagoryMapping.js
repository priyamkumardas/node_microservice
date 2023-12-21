/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors/CommonError');

class category_Mapping extends Model {
  static get tableName() {
    return 'category_mapping';
  }

  static async getAllMapping() {
    try {
      const result = await category_Mapping.query().select('*').where();
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateCategoryMapping(category_id, args) {
    try {
      // await category_Mapping.query().delete().where('category_id','=',category_id);
      const result = await category_Mapping.query().insert(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async bulkInsertMapping(args) {
    try {
      // await category_Mapping.query().delete().where('category_id','=',category_id);
      const result = await category_Mapping.query().insertGraph(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getCategoryMapping(category_id) {
    try {
      const result = await category_Mapping.query().select('parent_id').where('category_id', '=', category_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = category_Mapping;
