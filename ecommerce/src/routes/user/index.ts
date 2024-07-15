"use strict";
import express from "express";
import { asyncHandler } from "../../auth/checkAuth";
import userController from "../../controllers/user.controller";
import { body } from "express-validator";
import { validateCreateUser } from "../../middlewares/validate.middleware";

const userValidationRules = [
  body("email").isEmail().withMessage("Email must be valid"),
];

const router = express.Router();

router.post(
  "/newUser",
  userValidationRules,
  validateCreateUser,
  asyncHandler(userController.newUser)
);
router.get("/verify", asyncHandler(userController.checkRegisterEmailToken));

export default router;
