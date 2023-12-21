/* eslint-disable camelcase */
const { Model } = require('objection');
const { DATA_BASE_ERROR } = require('../errors');

class WorkingHours extends Model {
  static get tableName() {
    return 'workinghours';
  }

  static async create(records, shop_id) {
    try {
      await this.delete(shop_id);
      const result = await WorkingHours.query().insert(records).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getShopTiming(shop_id) {
    try {
      const result = await WorkingHours.query().select('*').where('shop_id', '=', shop_id).orderBy('created_at');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async findAllShopOpenInTime(start_time, end_time) {
    try {
      const result = WorkingHours.query()
        .select('shop_id')
        .where('start_time', '<=', start_time)
        .andWhere('end_time', '>=', end_time);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async toggleStatus(userId, shiftId, isActive) {
    try {
      const result = await WorkingHours.query()
        .patch({ is_active: isActive })
        .where('shop_id', '=', userId)
        .where('shift_id', '=', shiftId);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async delete(shopId) {
    try {
      const result = WorkingHours.query().delete().where('shop_id', '=', shopId);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async findAvailableUsers(currentTime) {
    try {
      const result = WorkingHours.query()
        .select('shop_id')
        .where('start_time', '<=', currentTime)
        .where('end_time', '>=', currentTime)
        .where('is_active', '=', true)
        .groupBy('shop_id');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = WorkingHours;
