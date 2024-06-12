import mongoose from "mongoose";

// ORDER_001 : order successfully
// ORDER_002 : order failed
// PROMOTION_001 : new promotion
// PROMOTION_002 : promotion expired
// SHOP_001 : new product by user following

const notificationSchema = new mongoose.Schema(
  {
    noti_type: {
      type: String,
      enum: [
        "ORDER_001",
        "ORDER_002",
        "PROMOTION_001",
        "PROMOTION_002",
        "SHOP_001",
      ],
      required: true,
    },
    noti_senderId: {
      type: String,
      required: true,
    },
    noti_receivedId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const NotificationModel = mongoose.model(
  "NotificationModel",
  notificationSchema,
  "notifications"
);
export default NotificationModel;
