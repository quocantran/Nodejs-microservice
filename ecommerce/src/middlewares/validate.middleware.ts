"use strict";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../core/error.response";

const validateCreateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    throw new BadRequestError(errors.array()[0].msg);
  }
  next();
};

export { validateCreateUser };
