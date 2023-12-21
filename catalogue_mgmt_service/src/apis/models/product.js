/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors/CommonError');
const Catalog = require('./catalog');

class product extends Model {
  static get tableName() {
    return 'product';
  }

  static get idColumn() {
    return 'product_id';
  }

  static async createProduct(args) {
    try {
      const result = await product.query().insert(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async productBulkUpload(args) {
    try {
      const result = await product.query().insertGraph(args).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async productByName(name) {
    try {
      const result = await product.query().select('*').where('name', '=', name);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProducts(filterSearch) {
    try {
      /*
       Adding default values in case pageSize is undefined
    */
      if (!filterSearch.pageSize?.length) {
        filterSearch.pageSize = 50;
        filterSearch.offset = 0;
        filterSearch.limit = 50;
      }

      const result = await product
        .query()
        .select('*')
        .where('status', '=', 'ACTIVE')
        .orderBy('id')
        .page(filterSearch.offset, filterSearch.limit)
        .modify((queryBuilder) => {
          if (filterSearch.q && filterSearch.q != null && filterSearch.q != '') {
            const params = new URLSearchParams('q=' + filterSearch.q);
            var queryString = filterSearch.q.includes('+') ? filterSearch.q : params.get('q');
            queryBuilder.where('name', 'ilike', `%${queryString}%`).orWhere('id', 'ilike', `%${queryString}%`);
          }
        });

      var productsData = result.results;

      productsData = productsData.map((p) => {
        return {
          ...p,
          category: {},
          subCategories: [],
        };
      });

      for (var i = 0; i < productsData.length; i++) {
        const subResult = await Catalog.query()
          .distinct(
            'catalog.id as catalog_id',
            'catalog.name as catalog_name',
            'category.id as category_id',
            'category.name as category_name',
          )
          .join('category_mapping', 'catalog.id', 'category_mapping.catalog_id')
          .join('category', 'category_mapping.category_id', 'category.id')
          .join('category_product', 'catalog.id', 'category_product.catalog_id')
          .where('category_product.product_id', productsData[i].id);

        if (subResult.length !== 0) {
          productsData[i].category = {
            id: subResult[0].catalog_id,
            name: subResult[0].catalog_name,
          };

          subResult.forEach((res) => {
            productsData[i].subCategories.push({
              id: res.category_id,
              name: res.category_name,
            });
          });
        }
      }

      return { products: productsData, totalCount: result.total, count: result.results.length };
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductById(product_id) {
    try {
      const result = await product.query().where('id', '=', product_id).first();
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateProduct(product_id, args) {
    try {
      const result = await product.query().update(args).where('id', '=', product_id);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async deleteProductId(product_id) {
    try {
      const result = await product.query().where('id', '=', product_id).patch({ status: 'DELETED' });
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductListsByIds(productIds) {
    try {
      const result = await product.query().findByIds(productIds);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductByDummyKey(dummyKey) {
    try {
      const result = await product.query().select('*').where('dummyKey', '=', dummyKey);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getProductByDummyKeys(dummyKeys) {
    try {
      const result = await product.query().select('*').whereIn('dummyKey', dummyKeys);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = product;
