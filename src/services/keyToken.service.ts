"use strict";

import mongoose from "mongoose";
import KeyTokenModel from "../models/keytoken.model";

interface IData {
  userId: string;
  publicKey: any;
  refreshToken: string;
}

class KeyTokenService {
  static createKeyToken = async (data: IData) => {
    const filter = { user: data.userId };
    const update: any = {
      publicKey: data.publicKey,
      refreshTokensUsed: [],
      refreshToken: data.refreshToken,
    };

    const options = { upsert: true, new: true };

    await KeyTokenModel.findOneAndUpdate(filter, update, options);
  };

  static findByUserId = async (userId: string) => {
    const keyToken = await KeyTokenModel.findOne({ user: userId });
    return keyToken;
  };

  static removeKeyById = async (keyStoreId: mongoose.Types.ObjectId) => {
    return await KeyTokenModel.deleteOne({ _id: keyStoreId });
  };

  static findByRefreshTokenUsed = async (refreshToken: string) => {
    return await KeyTokenModel.findOne({
      refreshTokensUsed: refreshToken,
    }).lean();
  };
  static findByRefreshToken = async (refreshToken: string) => {
    return await KeyTokenModel.findOne({
      refreshToken,
    });
  };

  static deleteKeyById = async (userId: string) => {
    return await KeyTokenModel.deleteOne({ user: userId });
  };
}
export default KeyTokenService;
