"use strict";

import express, { Request, Response } from "express";
import accessRouter from "./access";

const router = express.Router();

router.use("/api/v1", accessRouter);

export default router;
