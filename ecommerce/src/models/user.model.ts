import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema(
  {
    user_id: {
      type: Number,
      required: true,
    },
    user_slug: {
      type: String,
      required: true,
    },
    user_password: {
      type: String,
      required: true,
    },
    user_status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    user_email: {
      type: String,
      default: false,
      required: true,
    },
    user_name: {
      type: String,
      required: true,
    },
    user_role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  },
  { timestamps: true }
);

//Export the model
const User = mongoose.model("User", userSchema, "users");
export default User;
