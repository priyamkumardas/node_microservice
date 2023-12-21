const moment = require("moment");
const isDate = (date) => {
  return moment(date, "DD-MM-YYYY", true).isValid();
};
module.exports = { isDate };
