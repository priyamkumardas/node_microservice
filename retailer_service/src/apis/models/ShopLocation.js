/* eslint-disable camelcase */

const { distance } = require('@root/src/config');
const knex = require('knex');
const knexPostgis = require('knex-postgis');

const db = knex({
  client: 'postgres',
});
const st = knexPostgis(db);

const { Logger } = require('sarvm-utility');
const { Model, raw } = require('objection');
const { DATA_BASE_ERROR } = require('../errors');
class ShopLocation extends Model {
  static get tableName() {
    return 'shop_location';
  }

  static async insertItem(shop_id, longitude, latitude) {
    try {
      const point = `point(${longitude} ${latitude})`;
      const result = await ShopLocation.query()
        .insert({
          shop_id,
          longitude,
          latitude,
          shoplocation: st.geomFromText(point, 4326),
        })
        .returning('*');
      return result;
    } catch (error) {
      Logger.error({error:error})
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async updateShopLocation(shop_id, longitude, latitude) {
    try {
      const point = `point(${longitude} ${latitude})`;
      const data = {
        longitude,
        latitude,
        shoplocation: st.geomFromText(point, 4326),
      };
      const result = await ShopLocation.query().patch(data).where('shop_id', '=', shop_id).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getShops(longitude, latitude, userId, hasDummySub = false) {
    try {
      const point = `point(${longitude} ${latitude})`;
      const result = await ShopLocation.query()
        .select([
          'shop.*',
          'shop_location.*',
          raw('ST_Distance("shoplocation", ST_geomFromText(?, 4326)) * 1.609 * 100 as "distance"', [point]),
        ])
        .innerJoin('shop', 'shop.shop_id', 'shop_location.shop_id')
        .where(st.dwithin('shoplocation', st.geomFromText(point, 4326), distance))
        .where((builder) => {
          console.log({ hasDummySub });
          if (hasDummySub) builder.whereRaw('(shop."isSubscribed" = true or shop."hasDummySub" = true)');
          else builder.whereRaw('(shop."isSubscribed" = true)');
          if (userId) builder.orWhere('shop.user_id', userId);
        })
        .orderByRaw('shop."isSubscribed" desc NULLS LAST')
        .orderBy('distance');
      return result;
    } catch (error) {
      console.log("error is", error)
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async getShops2(longitude, latitude, km, limit, offset, category) {
    try {
      const point = `point(${longitude} ${latitude})`;
      const result = await ShopLocation.query().modify((queryBuilder) => {
        queryBuilder
          // .distinctOn('shop.updated_at')
          .select('*')
          .join('shop', 'shop_location.shop_id', '=', 'shop.shop_id')
          // .join('store_meta_data', 'shop_location.shop_id', '=', 'store_meta_data.shop_id')
          .where(st.dwithin('shoplocation', st.geomFromText(point, 4326), distance))
          .orderBy('shop.isSubscribed', 'asc')
          .orderBy('shop.updated_at', 'desc');
        // if (limit && limit != '') {
        //   queryBuilder.limit(limit);
        // }
        // if (offset && offset != '') {
        //   queryBuilder.offset(offset);
        // }
      });
      // const result = await ShopLocation.query()
      //   .distinctOn('shop.updated_at')
      //   .select('*')
      //   .join('shop', 'shop_location.shop_id', '=', 'shop.shop_id')
      //   // .join('store_meta_data', 'shop_location.shop_id', '=', 'store_meta_data.shop_id')
      //   .where(st.dwithin('shoplocation', st.geomFromText(point, 4326), 100000000))
      //   .orderBy('shop.updated_at', 'desc')

      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = ShopLocation;
