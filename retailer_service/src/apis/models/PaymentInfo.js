const { Model } = require('objection');

class PaymentInfo extends Model {
  static get tableName() {
    return 'payment_info';
  }
}

module.exports = PaymentInfo;
