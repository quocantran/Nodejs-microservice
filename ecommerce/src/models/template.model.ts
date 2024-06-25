import mongoose, { Schema } from "mongoose";

// Declare the Schema of the Mongo model
const templateSchema = new mongoose.Schema(
  {
    template_id: {
      type: Number,
      required: true,
    },
    template_name: {
      type: String,
      required: true,
    },
    template_status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    template_content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Export the model
const Template = mongoose.model("Template", templateSchema, "templates");
export default Template;
