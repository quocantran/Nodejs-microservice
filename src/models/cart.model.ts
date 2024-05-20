import mongoose from "mongoose";
// Declare the Schema of the Mongo model
const cartSchema = new mongoose.Schema(
  {
    cart_status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive", "completed", "failed"],
    },

    cart_products: {
      type: Array,
      required: true,
      default: [],
    },
    cart_userId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    cart_total: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const CartModel = mongoose.model("CartModel", cartSchema, "carts");

//Export the model
export default CartModel;
