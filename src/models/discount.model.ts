import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    discount_description: {
      type: String,
      required: true,
      trim: true,
      maxLength: 150,
    },
    discount_type: {
      type: String,
      default: "fixed_amount",
      enum: ["fixed_amount", "percentage"],
    },

    discount_value: {
      type: Number,
      required: true,
    },

    discount_code: {
      type: String,
      required: true,
    },

    discount_start_date: {
      type: Date,
      required: true,
    },
    discount_end_date: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      type: Number,
      required: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },

    discount_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    discount_status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    discount_apply_to: {
      type: String,
      required: true,
      enum: ["all_products", "specific_products"],
    },

    discount_product_ids: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const DiscountModel = mongoose.model(
  "DiscountModel",
  discountSchema,
  "discounts"
);
export default DiscountModel;
