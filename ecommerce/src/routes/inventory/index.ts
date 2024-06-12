import express from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../auth/checkAuth";
import inventoryController from "../../controllers/inventory.controller";


const router = express.Router();

router.use(authentication);

router.post("/", asyncHandler(inventoryController.addStockToInventory));

export default router;
