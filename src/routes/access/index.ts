import express from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";

const router = express.Router();

router.post("/shop/register", asyncHandler(accessController.register));
router.post("/shop/login", asyncHandler(accessController.login));

export default router;
