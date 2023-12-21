/* eslint-disable camelcase */
const { connections } = require('mongoose');
const { Model } = require('objection');
const { Connection } = require('pg');
const { DATA_BASE_ERROR } = require('../errors/CommonError');

class category extends Model {
  static get tableName() {
    return 'category';
  }

  static get idColumn() {
    return 'category_id';
  }

  static async addCategory(args) {
    try {
      const result = await category.query().insert(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getCategories(filterSearch) {
    try {
      // const result = await category.query().select('*');
      // return result;
      const result = await category
        .query()
        .select('*')
        .orderBy('id')
        .page(filterSearch.offset, filterSearch.limit)
        .modify((queryBuilder) => {
          if (filterSearch.q && filterSearch.q != null && filterSearch.q != '') {
            queryBuilder.where('name', 'ilike', `%${filterSearch.q}%`);
          }
        });
      return { categories: result.results, totalCount: result.total, count: result.results.length };
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async category() {
    try {
      const result = await category.query().select('*').whereNull('parent_id');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async subCategory(parent_id) {
    try {
      const result = await category.query().select('*').where('parent_id', '=', parent_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async categorysByDummyKeys(dummyKeys) {
    try {
      const result = await category.query().select('*').whereIn('dummyKey', dummyKeys);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateCategoryByCategoryIdAndCatalogId(categoryCatalogMap) {
    try {
      return category.transaction((trx) => {
        const queries = [];
        categoryCatalogMap.forEach((cat) => {
          const query = category
            .query()
            .where('category_id', cat.category_id)
            .update({
              catalog_id: cat.catalog_id,
            })
            .transacting(trx); // This makes every update be in the same transaction
          queries.push(query);
        });

        Promise.all(queries) // Once every query is written
          .then(trx.commit) // We try to execute all of them
          .catch(trx.rollback); // And rollback in case any of them goes wrong
      });
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateCategoryMicroCategoryMapping(categoryMicroCategoryMapping) {
    try {
      return category.transaction((trx) => {
        const queries = [];
        categoryMicroCategoryMapping.forEach((cat) => {
          const query = category
            .query()
            .where('category_id', cat.category_id)
            .update({
              parent_id: cat.parent_id,
            })
            .transacting(trx); // This makes every update be in the same transaction
          queries.push(query);
        });

        Promise.all(queries) // Once every query is written
          .then(trx.commit) // We try to execute all of them
          .catch(trx.rollback); // And rollback in case any of them goes wrong
      });
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getCategoryById(category_id) {
    try {
      const result = await category.query().where('id', '=', category_id).first();
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateCategory(category_id, args) {
    try {
      const result = await category.query().update(args).where('id', '=', category_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteCategoryById(category_id) {
    try {
      const result = await category.query().where('id', '=', category_id).patch({ status: 'DELETED' });
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async categoriesByCatalogId(catalog_id) {
    try {
      const result = await category.query().select('*').where('catalog_id', '=', catalog_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async categoriesByParentId(parent_id) {
    try {
      const result = await category.query().select('*').where('parent_id', '=', parent_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async categeriesByDummyId(dummyKey) {
    try {
      const result = await category.query().select('*').where('dummyKey', '=', dummyKey);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = category;
