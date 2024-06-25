import express from "express";
import profileController from "../../controllers/profile.controller";
import { asyncHandler } from "../../auth/checkAuth";
import { grantAccess } from "../../middlewares/rbac";

const router = express.Router();

//admin

router.get(
  "/viewAny",
  grantAccess("readAny", "profile"),
  asyncHandler(profileController.profiles)
);

//shop

router.get(
  "/viewOwn",
  grantAccess("readOwn", "profile"),
  asyncHandler(profileController.profile)
);

export default router;
