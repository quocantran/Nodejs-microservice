import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const resourceSchema = new mongoose.Schema(
  {
    src_name: {
      type: String,
      required: true,
    },
    src_description: {
      type: String,
      required: true,
      default: "",
    },
    src_slug: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
const Resource = mongoose.model("Resource", resourceSchema, "resources");
export default Resource;
