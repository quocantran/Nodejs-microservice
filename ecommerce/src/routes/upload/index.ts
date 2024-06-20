import express from "express";
import uploadController from "../../controllers/upload.controller";
import { asyncHandler } from "../../auth/checkAuth";
import { multerMemory } from "../../configs/multer.config";
const router = express.Router();

router.post(
  "/",
  multerMemory.single("file"),
  asyncHandler(uploadController.uploadFile)
);

export default router;
