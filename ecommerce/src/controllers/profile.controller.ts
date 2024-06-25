"use strict";

import { OK } from "../core/success.response";
import { Request, Response } from "express";

const dataProfiles = [
  {
    id: 1,
    name: "Admin",
    email: "admin@gmail.com",
  },
  {
    id: 2,
    name: "User",
    email: "user@gmail.com",
  },
];

class ProfileController {
  profiles = async (req: Request, res: Response) => {
    new OK({
      message: "view all profiles",
      metadata: dataProfiles,
    }).sendResponse(res);
  };

  profile = async (req: Request, res: Response) => {
    new OK({
      message: "view own profile",
      metadata: {
        id: 2,
        name: "User",
        email: "user@gmail.com",
      },
    }).sendResponse(res);
  };
}

export default new ProfileController();
