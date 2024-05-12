"use strict";

import KeyTokenModel from "../models/keytoken.model";

interface IData {
  userId: string;
  publicKey: any;
}

class KeyTokenService {
  static createKeyToken = async (data: IData) => {
    try {
      const { userId, publicKey } = data;

      const publicKeyString = publicKey.toString();

      const tokens = await KeyTokenModel.create({
        user: userId,
        publicKey: publicKeyString,
      });
      return tokens ? publicKeyString : null;
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}
export default KeyTokenService;
