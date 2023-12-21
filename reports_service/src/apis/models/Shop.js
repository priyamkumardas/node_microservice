const { Model } = require("objection");
const moment = require("moment");
function isDate(date) {
  return moment(date, "DD-MM-YYYY", true).isValid();
}
class Shop extends Model {
  static get tableName() {
    return "shop";
  }
  static async shopLists(startDate, endDate) {
    try {
      const result = await Shop.query()
        .select("*")
        .modify((queryBuilder) => {
          // queryBuilder.select("*");
          if (
            startDate &&
            startDate != "" &&
            isDate(startDate) &&
            endDate &&
            endDate != "" &&
            isDate(endDate)
          ) {
            let fromDate = startDate + " 00:00:00";
            let toDate = endDate + " 23:59:59";
            let from = moment(fromDate, "DD-MM-YYYY HH:mm:ss").format(
              "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
            );

            let to = moment(toDate, "DD-MM-YYYY HH:mm:ss").format(
              "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]"
            );
            queryBuilder.where("created_at", ">=", from);
            queryBuilder.where("created_at", "<=", to);
            queryBuilder.orderBy("created_at", "DESC");
          }
        });
      //console.log(result.length);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async shopListsByUserIds(userIds) {
    try {
      const result = await Shop.query().select("*").whereIn("user_id", userIds);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async shopListsByUserId(userId) {
    try {
      const result = await Shop.query().select("*").where("user_id", userId);
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
  static async getshopids() {
    try {
      const result = await Shop.query().select("*");
      return result;
    } catch (error) {
      throw new DATA_BASE_ERROR(error);
    }
  }
}

module.exports = Shop;
