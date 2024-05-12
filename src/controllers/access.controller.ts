"use strict";
import express, { NextFunction, Request, Response } from "express";
import AccessService from "../services/access.service";

class AccessController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(201).json(await AccessService.register(req.body));
    } catch (error) {
      next(error);
    }
  };
}

export default new AccessController();
