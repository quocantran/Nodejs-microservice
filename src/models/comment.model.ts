import mongoose, { Schema } from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    comment_productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductModel",
    },
    comment_userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    comment_content: {
      type: String,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: "CommentModel",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("CommentModel", commentSchema, "comments");
export default CommentModel;
