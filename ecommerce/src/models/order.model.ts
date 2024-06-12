import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: String,
      required: true,
      unique: true,
    },
    order_checkout: {
      type: Object,

      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },

    order_payment: {
      type: Object,
      default: {},
    },
    order_products: {
      type: Array,
      default: [],
      required: true,
    },
    order_tracking: {
      type: String,
    },
    order_status: {
      type: String,
      default: "pending",
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
    },
  },
  { timestamps: true }
);

const OrderModel = mongoose.model("OrderModel", orderSchema);
export default OrderModel;
