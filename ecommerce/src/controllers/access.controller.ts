"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, OK } from "../core/success.response";
import { RequestWithKeyStore } from "../auth/authUtils";

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

  logout = async (
    req: RequestWithKeyStore,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Logout Success",
      metadata: await AccessService.logout(req.keyStore),
    }).sendResponse(res);
  };

  refreshToken = async (
    req: RequestWithKeyStore,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Refresh Token Success",
      metadata: await AccessService.refreshToken(
        req.keyStore,
        req.refreshToken
      ),
    }).sendResponse(res);
  };
}

export default new AccessController();
