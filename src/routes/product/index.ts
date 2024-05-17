import express from "express";
import productController from "../../controllers/product.controller";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";

const router = express.Router();
router.get("/search", asyncHandler(productController.searchProduct));
router.get("/", asyncHandler(productController.getProductsPaginated));

router.use(authentication);

router.patch("/:productId", asyncHandler(productController.updateProduct));
router.post("/create", asyncHandler(productController.createProduct));

export default router;
