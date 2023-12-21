const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    retailerPhone: String,
    customerPhone: String,
    amount: Number,
    order_id: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Orders", orderSchema);
module.exports = {
  Order,
};
