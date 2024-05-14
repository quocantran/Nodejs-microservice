"use strict";

import KeyTokenModel from "../models/keytoken.model";

interface IData {
  userId: string;
  publicKey: any;
  refreshToken: string;
}

class KeyTokenService {
  static createKeyToken = async (data: IData) => {
    // const { userId, publicKey } = data;

    // const publicKeyString = publicKey.toString();

    // const tokens = await KeyTokenModel.create({
    //   user: userId,
    //   publicKey: publicKeyString,
    // });
    // return tokens ? publicKeyString : null;

    const filter = { user: data.userId };
    const update: any = {
      publicKey: data.publicKey,
      refreshTokensUsed: [],
      refreshToken: data.refreshToken,
    };

    const options = { upsert: true, new: true };

    const tokens = await KeyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
  };
}
export default KeyTokenService;
