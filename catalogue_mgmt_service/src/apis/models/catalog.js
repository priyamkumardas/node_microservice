/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors/CommonError');

class catalog extends Model {
  static get tableName() {
    return 'catalog';
  }

  static get idColumn() {
    return 'catalog_id';
  }

  static async addCatalog(args) {
    try {
      const result = await catalog.query().insert(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async addBulkCatalog(args) {
    try {
      const result = await catalog.query().insert(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async catalogByIdDummyId(dummyKey) {
    try {
      const result = await catalog.query().select('*').where('dummyKey', '=', dummyKey);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async catalogByDummyKeys(dummyKeys) {
    try {
      const result = await catalog.query().select('*').whereIn('dummyKey', dummyKeys);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async catalogList(filterSearch) {
    try {
      // const result = await catalog.query().select('*');
      // return result;
      const result = await catalog
        .query()
        .select('*')
        .orderBy('id')
        .page(filterSearch.offset, filterSearch.limit)
        .modify((queryBuilder) => {
          if (filterSearch.q && filterSearch.q != null && filterSearch.q != '') {
            queryBuilder.where('name', 'ilike', `%${filterSearch.q}%`);
          }
        });
      return { catalog: result.results, totalCount: result.total, count: result.results.length };
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getCatalogById(catalog_id) {
    try {
      const result = await catalog.query().where('id', '=', catalog_id).first();
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getCatalogByShopId(shop_id) {
    try {
      const result = await catalog.query().where('shop_id', shop_id).andWhere('active', true);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateCatalog(catalog_id, args) {
    try {
      const result = await catalog.query().update(args).where('id', '=', catalog_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteCatalogById(catalog_id) {
    try {
      const result = await catalog.query().where('id', '=', catalog_id).patch({ status: 'DELETED' });
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = catalog;
