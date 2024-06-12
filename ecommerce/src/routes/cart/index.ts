import express from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";
import cartController from "../../controllers/cart.controller";

const router = express.Router();

router.use(authentication);

router.get("/", asyncHandler(cartController.getListCartUser));
router.post("/add-to-cart", asyncHandler(cartController.addToCart));
router.post("/update-cart", asyncHandler(cartController.updateCart));
router.delete("/delete-cart", asyncHandler(cartController.deleteCart));

export default router;
