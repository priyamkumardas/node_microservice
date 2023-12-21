/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors/CommonError');

class categoryProduct extends Model {
  static get tableName() {
    return 'category_product';
  }

  static async addProductMapping(args, product_id) {
    try {
      await categoryProduct.query().delete().where('product_id', '=', product_id);
      const result = await categoryProduct.query().insert(args).returning('*');
      return result;
    } catch (error) {
      console.log(error);
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async insertProductMapping(arrayOfCategoryProduct, product_id) {
    try {
      await categoryProduct.query().delete().where('product_id', product_id);
      const result = await categoryProduct.query().insert(arrayOfCategoryProduct).returning('*');
      return result;
    } catch (error) {
      console.log(error);
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async addProdctMappingWhileAddingProduct(args) {
    try {
      const result = await categoryProduct.query().insertGraph(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductMapping(product_id) {
    try {
      const result = await categoryProduct.query().where('product_id', '=', product_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductList(category_id) {
    try {
      const result = await categoryProduct.query().select('product_id').where('category_id', '=', category_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductCategoryMapping(product_id, category_id) {
    try {
      const result = await categoryProduct
        .query()
        .select('*')
        .where('category_id', '=', category_id)
        .andWhere('product_id', '=', product_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async getAllProductMapping(productIds) {
    try {
      const result = await categoryProduct.query().select('*').whereIn('product_id', productIds).orderBy('product_id');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = categoryProduct;
