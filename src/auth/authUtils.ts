import jwt from "jsonwebtoken";
import { asyncHandler } from "./checkAuth";
import { BadRequestError, UnauthorizedError } from "../core/error.response";
import KeyTokenService from "../services/keyToken.service";
import { Request, Response, NextFunction } from "express";
import { IDecoded, IKeyStore } from "../interfaces";

const HEADER = {
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export interface RequestWithKeyStore extends Request {
  keyStore: IKeyStore;
}

export const createTokenPair = async (
  payload: IDecoded,
  publicKey: any,
  privateKey: any
) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    jwt.verify(refreshToken, publicKey, (err: any, decoded: IDecoded) => {
      if (err) {
        throw new Error("Access token is invalid");
      }
      return decoded;
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};

export const authentication = asyncHandler(
  async (req: RequestWithKeyStore, res: Response, next: NextFunction) => {
    const userId = req.headers[HEADER.CLIENT_ID]?.toString();
    if (!userId) {
      throw new UnauthorizedError("not found user");
    }

    const keyStore = await KeyTokenService.findByUserId(userId);
    if (!keyStore) {
      throw new BadRequestError("not found keyStore", 404);
    }

    const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();

    if (!accessToken) {
      throw new UnauthorizedError("not found token");
    }

    try {
      const decoded: any = jwt.verify(accessToken, keyStore.publicKey);
      if (userId !== decoded.userId) {
        throw new UnauthorizedError("Invalid token");
      }
      req.keyStore = keyStore;
      return next();
    } catch (error) {
      throw error;
    }
  }
);

export const checkRefreshToken = (
  refreshToken: string,
  keySecret: string
): IDecoded => {
  const decoded = jwt.verify(refreshToken, keySecret);
  return decoded as IDecoded;
};
