const knex = require('knex');
const { Model, raw } = require('objection');
const { DATA_BASE_ERROR } = require('../errors');

const PaymentInfo = require('./PaymentInfo');

class Retailer extends Model {
  static get tableName() {
    return 'retailer';
  }

  static async addRetailer(user_id, retailerDetails) {
    try {
      const retailer = await Retailer.query().findOne({ user_id });
      retailerDetails.r_id = retailer.r_id;
      const result = PaymentInfo.query().insert(retailerDetails).returning('*');
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }

  static async getAllRetailer() {
    try {
      const retailer = await Retailer.query();
      return retailer;
    } catch (error) {
      throw new Error('No retailer found.');
    }
  }

  static async getRetailer(user_id) {
    // Find the rId based on the user_id
    const retailer = await Retailer.query().findOne({ user_id });

    if (retailer) {
      const r_id = retailer.r_id;

      // Fetch the payment_info records associated with the rId
      const paymentInfos = await PaymentInfo.query().where({ r_id });

      // Add user_id, rId, and other_data to the payment info objects
      const extendedPaymentInfos = paymentInfos.map((paymentInfo) => {
        return {
          ...paymentInfo,
          user_id,
        };
      });

      return extendedPaymentInfos;
    } else {
      throw new Error('Retailer not found.');
    }
  }

  static async updateRetailer(paymentAppData, data) {
    try {
      let result = await PaymentInfo.query().patch(data).where(paymentAppData);
      return result;
    } catch (error) {
      throw new Error('Retailer not found.');
    }
  }

  static async deletePaymentApp(paymentAppData) {
    try {
      const deletedCount = await PaymentInfo.query().delete().where(paymentAppData);
      return deletedCount;
    } catch (error) {
      throw new Error('Retailer not found.');
    }
  }
}

module.exports = Retailer;
