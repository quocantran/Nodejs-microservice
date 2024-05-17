import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductModel",
    },
    inven_location: {
      type: String,
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    inven_reservations: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const InventoryModel = mongoose.model(
  "InventoryModel",
  inventorySchema,
  "inventories"
);
export default InventoryModel;
