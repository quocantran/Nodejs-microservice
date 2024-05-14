import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const productSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    product_attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },

  { timestamps: true }
);

//Export the model
export const Product = mongoose.model("Product", productSchema, "Product");

const clothingSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
    size: {
      type: String,
    },
    material: String,
  },
  { timestamps: true }
);

export const Clothing = Product.discriminator(
  "Clothing",
  clothingSchema,
  "Clothing"
);

const electronicSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Electronics = Product.discriminator(
  "Electronics",
  electronicSchema,
  "Electronics"
);
