import mongoose, { Schema } from "mongoose";
import slugify from "slugify";

// Declare the Schema of the Mongo model
const spuSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      default: "",
    },

    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_quantity: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Array,
      required: true,
      default: [],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    product_slug: {
      type: String,
    },
    product_variations: {
      type: Array,
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

spuSchema.index({ product_name: "text", product_description: "text" });

spuSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true });
  next();
});

//Export the model
export const Spu = mongoose.model("Spu", spuSchema, "spus");
