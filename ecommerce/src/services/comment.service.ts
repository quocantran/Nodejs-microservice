"use strict";

import mongoose, { Mongoose, Schema } from "mongoose";
import CommentModel from "../models/comment.model";
import { BadRequestError } from "../core/error.response";
import { IComment } from "../interfaces";
import { getProductById } from "../models/repositories/product.repo";

class CommentService {
  static async createComment(payload: IComment) {
    const { productId, userId, content, parentId } = payload;
    const comment = new CommentModel({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentId,
    });
    let rightValue;
    if (parentId) {
      const parentComment = await CommentModel.findOne({
        _id: parentId,
      });
      if (!parentComment) {
        throw new BadRequestError("Parent comment not found");
      }
      rightValue = parentComment.comment_right;

      await CommentModel.updateMany(
        {
          comment_productId: new Schema.Types.ObjectId(productId),
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );
      await CommentModel.updateMany(
        {
          comment_productId: new Schema.Types.ObjectId(productId),
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await CommentModel.findOne(
        {
          comment_productId: new Schema.Types.ObjectId(productId),
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );
      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }
    comment.comment_left = rightValue;
    comment.comment_right = rightValue + 1;
    await comment.save();
    return comment;
  }

  static async getCommentsByParentId(payload: any) {
    const { productId, parentId, page, limit } = payload;
    const skip = (page - 1) * limit;
    const parentComment = await CommentModel.findOne({
      _id: new Schema.Types.ObjectId(parentId),
    });
    if (!parentComment) {
      throw new BadRequestError("Parent comment not found");
    }
    const comments = await CommentModel.find({
      comment_productId: new mongoose.Types.ObjectId(productId),
      comment_left: { $gt: parentComment.comment_left },
      comment_right: { $lt: parentComment.comment_right },
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    return {
      meta: {
        total: comments.length,
        page,
        limit,
      },
      result: comments,
    };
  }

  static async deleteComment(commentId: string, productId: string) {
    const product = await getProductById(new Schema.Types.ObjectId(productId));
    if (!product) {
      throw new BadRequestError("Product not found");
    }

    const comment = await CommentModel.findOne({
      _id: new Schema.Types.ObjectId(commentId),
    });
    if (!comment) {
      throw new BadRequestError("Comment not found");
    }
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    const width = rightValue - leftValue + 1;
    await CommentModel.deleteMany({
      comment_productId: new Schema.Types.ObjectId(productId),
      comment_left: { $gte: leftValue },
      comment_right: { $lte: rightValue },
    });
    await CommentModel.updateMany(
      {
        comment_productId: new Schema.Types.ObjectId(productId),
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );
    await CommentModel.updateMany(
      {
        comment_productId: new Schema.Types.ObjectId(productId),
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );
    return comment;
  }
}

export default CommentService;
