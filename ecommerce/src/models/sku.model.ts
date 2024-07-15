import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const skuSchema = new mongoose.Schema(
  {
    sku_id: {
      type: String,
      required: true,
      unique: true,
    },

    product_id: {
      type: String,
      required: true,
    },

    /* 
        color = [red,green] = [0,1]
        size = [S,M] = [0,1]

        => red + S = [0,0]
           red + M = [0,1]

    */
    sku_tier_idx: {
      type: Array,
      default: [0],
    }, // [1,0] , [1,1]

    sku_slug: {
      type: String,
      default: "",
    },

    sku_sort: {
      type: Number,
      default: 0,
    },

    sku_default: {
      type: Boolean,
      default: false,
    },

    sku_stock: {
      type: Number,
      default: 0,
    },

    sku_price: {
      type: String,
      required: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

//Export the model
const Sku = mongoose.model("Sku", skuSchema, "skus");
export default Sku;
