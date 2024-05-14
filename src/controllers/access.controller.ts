"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";

class AccessController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Register Success",
      metadata: await AccessService.register(req.body),
    }).sendResponse(res);
  };
  login = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Login Success",
      metadata: await AccessService.login(req.body),
    }).sendResponse(res);
  };
}

export default new AccessController();
