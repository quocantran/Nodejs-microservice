"use strict";

import express, { Request, Response } from "express";
import accessRouter from "./access";
import { apiKey, checkPermission } from "../auth/checkAuth";

const router = express.Router();

//check apikey
router.use(apiKey);

//check permission
router.use(checkPermission("0000"));

router.use("/api/v1", accessRouter);

export default router;
