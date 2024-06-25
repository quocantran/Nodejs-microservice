import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "shop", "admin"],
    },
    role_slug: {
      type: String,
      required: true,
    },
    role_status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive"],
    },
    role_description: {
      type: String,
      default: "",
    },
    role_grants: [
      {
        resource: {
          type: Schema.Types.ObjectId,
          ref: "Resource",
          required: true,
        },
        actions: [
          {
            type: String,
            required: true,
          },
        ],
        attributes: [
          {
            type: String,
            default: "*",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

//Export the model
const Role = mongoose.model("Role", roleSchema, "roles");
export default Role;
