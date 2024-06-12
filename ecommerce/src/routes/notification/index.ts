import express from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";
import notificationController from "../../controllers/notification.controller";

const router = express.Router();

router.use(authentication);

router.get("/", asyncHandler(notificationController.getListNotiByUser));

export default router;
