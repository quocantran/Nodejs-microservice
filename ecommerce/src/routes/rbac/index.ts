import express from "express";
import { asyncHandler } from "../../auth/checkAuth";
import { authentication } from "../../auth/authUtils";
import rbacController from "../../controllers/rbac.controller";

const router = express.Router();

//admin

// router.use(authentication);

router.get("/getResources", asyncHandler(rbacController.getResources));
router.get("/getRoles", asyncHandler(rbacController.getRoles));
router.post("/createRole", asyncHandler(rbacController.createRole));
router.post("/createResource", asyncHandler(rbacController.createResource));

export default router;
