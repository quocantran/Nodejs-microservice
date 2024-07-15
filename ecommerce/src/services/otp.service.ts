"use strict";

import crypto from "crypto";
import Otp from "../models/otp.model";
import { BadRequestError } from "../core/error.response";

export default class OtpService {
  static newOtp = async ({ email = "" }) => {
    const token = OtpService.generatorTokenRandom();

    const newToken = await Otp.create({
      otp_token: token,
      otp_email: email,
    });
    return newToken;
  };

  static generatorTokenRandom = () => {
    const token = crypto.randomInt(0, Math.pow(2, 32));
    return token;
  };

  static checkToken = async ({ token = "" }) => {
    const otp = await Otp.findOne({ otp_token: token }).lean();
    if (!otp) {
      throw new BadRequestError("Token not found!");
    }

    await Otp.deleteOne({ otp_token: token });
    return otp;
  };
}
