"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";
import { RequestWithKeyStore } from "../auth/authUtils";

class UserController {
  newUser = async (req: Request, res: Response, next: NextFunction) => {};

  // check user token via email
  checkRegisterEmailToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {};
}

export default new UserController();
