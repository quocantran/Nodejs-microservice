"use strict";
import express from "express";
import { asyncHandler } from "../../auth/checkAuth";
import emailController from "../../controllers/email.controller";

const router = express.Router();

router.post("/newTemplate", asyncHandler(emailController.newTemplate));

export default router;
