"use strict";

import User from "../models/user.model";
import { BadRequestError } from "../core/error.response";
import EmailService from "./email.service";
import OtpService from "./otp.service";
import crypto from "crypto";
import { createTokenPair } from "../auth/authUtils";
import KeyTokenService from "./keyToken.service";
import { getInfoData } from "../utils";
import bcrypt from "bcrypt";
import { createUser } from "../models/repositories/user.repo";

export default class UserService {
  static newUser = async ({ email = "", captcha = null }) => {
    const user = await User.findOne({ user_email: email }).lean();
    console.log(user);

    if (user) {
      throw new BadRequestError("User already exist");
    }

    // send token via email user

    const result = await EmailService.sendEmail({ email });

    return result;
  };

  static findUserByEmail = async ({ email = "" }) => {
    return await User.findOne({ email }).lean();
  };

  static verifyEmailToken = async ({ token = "" }) => {
    const tokenUser = await OtpService.checkToken({ token });

    if (!tokenUser.otp_email) {
      throw new BadRequestError("Token not found!");
    }

    const user = await UserService.findUserByEmail({
      email: tokenUser.otp_email,
    });
    if (user) {
      throw new BadRequestError("User already exist!");
    }

    const passwordHash = await bcrypt.hash(tokenUser.otp_email, 10);

    const newUser = await createUser({
      user_email: tokenUser.otp_email,
      user_id: 1,
      user_name: tokenUser.otp_email,
      user_password: passwordHash,
      user_role: "66754ee0b7e8dea8e93b3a80",
      user_slug: "axxbbzz",
    });
    if (!newUser) {
      throw new BadRequestError("Create user failed!");
    }
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
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
      {
        userId: newUser._id,
        email: newUser.user_email,
      },
      publicKeyString,
      privateKey
    );

    const data = {
      userId: newUser._id,
      publicKey,
      refreshToken: tokens.refreshToken,
    };
    await KeyTokenService.createKeyToken(data);

    return {
      user: getInfoData({
        fileds: ["user_id", "user_email"],
        object: newUser,
      }),
      tokens,
    };
  };
}
