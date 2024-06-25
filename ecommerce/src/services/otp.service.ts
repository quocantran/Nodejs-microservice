"use strict";

import crypto from "crypto";
import Otp from "../models/otp.model";

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
}
