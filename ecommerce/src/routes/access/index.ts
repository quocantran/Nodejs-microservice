import express from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";
import { authentication } from "../../auth/authUtils";

const router = express.Router();

router.post("/shop/register", asyncHandler(accessController.register));
router.post("/shop/login", asyncHandler(accessController.login));

//authentication

router.use(authentication);

router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/refresh-token", asyncHandler(accessController.refreshToken));

export default router;
