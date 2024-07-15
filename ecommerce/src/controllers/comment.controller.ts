"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";
import { IUser } from "../auth/authUtils";
import CommentService from "../services/comment.service";

class CommentController {
  createComment = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Comment Created",
      metadata: await CommentService.createComment(req.body),
    }).sendResponse(res);
  };
  getCommentsByParentId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Comments Fetched",
      metadata: await CommentService.getCommentsByParentId(req.body),
    }).sendResponse(res);
  };
  deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const { productId, commentId } = req.body;
    new OK({
      message: "Comment Deleted",
      metadata: await CommentService.deleteComment(commentId, productId),
    }).sendResponse(res);
  };
}

export default new CommentController();
