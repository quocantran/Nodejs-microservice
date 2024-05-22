import express from "express";
import { asyncHandler } from "../../auth/checkAuth";
import { authentication } from "../../auth/authUtils";
import commentController from "../../controllers/comment.controller";

const router = express.Router();

//authentication

router.use(authentication);

router.post("/parent", asyncHandler(commentController.getCommentsByParentId));
router.post("/create", asyncHandler(commentController.createComment));
router.delete("/delete", asyncHandler(commentController.deleteComment));

export default router;
