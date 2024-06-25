"use strict";

import mongoose from "mongoose";
import Shop from "../models/shop.model";
import User from "../models/user.model";
import { BadRequestError } from "../core/error.response";

export default class UserService {
  static newUser = async ({ email = null, captcha = null }) => {
    const user = await User.findOne({ email }).lean();

    if (user) {
      throw new BadRequestError("User already exist");
    }

    // send token via email user
  };
}
