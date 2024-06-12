"use strict";

import { Request, Response, NextFunction } from "express";
import { findApiKeyById } from "../services/apikey.service";
import { IApiKey } from "../interfaces";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

interface RequestWithObjectKey extends Request {
  objectKey: IApiKey;
}

export const apiKey = async (
  req: RequestWithObjectKey,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();

    if (!key) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    const objectKey = await findApiKeyById(key);
    if (!objectKey) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }
    req.objectKey = objectKey;
    return next();
  } catch (err) {}
};

export const checkPermission = (permission: string) => {
  return (req: RequestWithObjectKey, res: Response, next: NextFunction) => {
    if (!req.objectKey.permissions) {
      return res.status(403).json({
        message: "Forbidden Error",
      });
    }

    const { permissions } = req.objectKey;
    if (permissions.includes(permission)) {
      return next();
    }
    return res.status(403).json({
      message: "Forbidden Error",
    });
  };
};

export const asyncHandler = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
