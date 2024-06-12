import express from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";
import checkoutController from "../../controllers/checkout.controller";

const router = express.Router();

router.use(authentication);

router.post("/review", asyncHandler(checkoutController.checkoutReview));

export default router;
