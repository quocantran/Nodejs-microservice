import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const otpSchema = new mongoose.Schema(
  {
    otp_token: {
      type: String,
      required: true,
    },
    otp_email: {
      type: String,
      required: true,
    },
    otp_status: {
      type: String,
      enum: ["active", "blocked", "pending"],
      default: "active",
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 60,
    },
  },
  { timestamps: true }
);

//Export the model
const Otp = mongoose.model("Otp", otpSchema, "otps");
export default Otp;
