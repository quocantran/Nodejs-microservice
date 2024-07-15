"use strict";

import { IKeyStore, IShop } from "../interfaces/index";
import Shop from "../models/shop.model";
import bcrypt from "bcrypt";
import crypto from "crypto";
import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { getInfoData } from "../utils";
import { BadRequestError, UnauthorizedError } from "../core/error.response";
import { findByEmail, findByShopId } from "./shop.service";

const RoleShop = {
  SHOP: "SHOP",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  WRITER: "WRITER",
};

class AccessService {
  static register = async (shop: IShop) => {
    const { name, email, password } = shop;
    const holderShop = await Shop.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Email already exists");
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

      const publicKeyString = publicKey.toString();
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKeyString,
        privateKey
      );
      const data = {
        userId: newShop._id,
        privateKey,
        publicKey,
        refreshToken: tokens.refreshToken,
      };
      await KeyTokenService.createKeyToken(data);

      return {
        shop: getInfoData({
          fileds: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }
  };

  static login = async ({
    email,
    password,
    refreshToken = null,
  }: {
    email: string;
    password: string;
    refreshToken: string;
  }) => {
    const shop = await findByEmail({ email });

    if (!shop) {
      throw new UnauthorizedError("Shop not found");
    }
    const match = await bcrypt.compare(password, shop.password);
    if (!match) {
      throw new UnauthorizedError("Shop not found");
    }
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

    const publicKeyString = publicKey.toString();
    const tokens = await createTokenPair(
      { userId: shop._id, email },
      publicKeyString,
      privateKey
    );
    const data = {
      userId: shop._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    };
    await KeyTokenService.createKeyToken(data);
    if (!publicKeyString) {
      throw new BadRequestError("Error create key token", 500);
    }

    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: shop,
      }),
      tokens,
    };
  };

  static logout = async (keyStore: IKeyStore) => {
    const deleteKey = await KeyTokenService.removeKeyById(keyStore._id);
    console.log({
      deleteKey,
    });

    return deleteKey;
  };

  static refreshToken = async (keyStore: IKeyStore, refreshToken: string) => {
    const { refreshTokensUsed, user } = keyStore;

    const foundToken = refreshTokensUsed.includes(refreshToken);

    if (foundToken) {
      await KeyTokenService.deleteKeyById(user);
      throw new BadRequestError("Something went wrong! please relogin");
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new UnauthorizedError("Shop is not registered");
    }

    const shop = await findByShopId({ id: user });
    if (!shop) {
      throw new UnauthorizedError("Shop is not registered2");
    }
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
    const publicKeyString = publicKey.toString();
    const tokens = await createTokenPair(
      { userId: user, email: shop.email },
      publicKeyString,
      privateKey
    );
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
        publicKey: publicKeyString,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });
    return {
      shop: getInfoData({
        fileds: ["_id", "name", "email"],
        object: shop,
      }),
      tokens,
    };
  };
}

export default AccessService;
