"use strict";

import { IShop } from "../interfaces/shop.interface";
import Shop from "../models/shop.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { getInfoData } from "../utils";

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  WRITER: "WRITER",
};

class AccessService {
  static register = async (shop: IShop) => {
    try {
      const { name, email, password } = shop;
      const holderShop = await Shop.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Email already exists",
          status: "error",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);

      const newShop = await Shop.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });
      if (newShop) {
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        const data = {
          userId: newShop._id as unknown as string,
          publicKey,
        };

        const publicKeyString = await KeyTokenService.createKeyToken(data);
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "Create key token failed",
          };
        }

        const publicKeyObject = crypto.createPublicKey(publicKey);
        console.log("publicKeyObject::::", publicKeyObject);

        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyString,
          privateKey
        );

        return {
          code: 20001,
          metadata: {
            shop: getInfoData({
              fileds: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

export default AccessService;
