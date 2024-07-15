"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";
import { IUser } from "../auth/authUtils";
import UserService from "../services/user.service";

class UserController {
  newUser = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "User created successfully!",
      metadata: await UserService.newUser(req.body),
    }).sendResponse(res);
  };

  // check user token via email
  checkRegisterEmailToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = req.query.token as string;
    new OK({
      message: "OK",
      metadata: await UserService.verifyEmailToken({ token }),
    }).sendResponse(res);
  };
}

export default new UserController();
