"use strict";

import express, { Request, Response } from "express";
import accessRouter from "./access";
import { apiKey, checkPermission } from "../auth/checkAuth";
import productRouter from "./product";
const router = express.Router();

//check apikey
router.use(apiKey);

//check permission
router.use(checkPermission("0000"));

router.use("/api/v1/product", productRouter);
router.use("/api/v1/auth", accessRouter);

export default router;
