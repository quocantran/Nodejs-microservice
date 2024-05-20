"use strict";

import express, { Request, Response } from "express";
import accessRouter from "./access";
import { apiKey, checkPermission } from "../auth/checkAuth";
import productRouter from "./product";
import cartRouter from "./cart";
import checkoutRouter from "./checkout";
import inventoryRouter from "./inventory";
const router = express.Router();

//check apikey
router.use(apiKey);

//check permission
router.use(checkPermission("0000"));

router.use("/api/v1/inventory", inventoryRouter);
router.use("/api/v1/checkout", checkoutRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/auth", accessRouter);
router.use("/api/v1/cart", cartRouter);

export default router;
