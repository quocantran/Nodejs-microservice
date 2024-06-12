"use strict";

import { Request, Response } from "express";
import { OK } from "../core/success.response";
import { RequestWithKeyStore } from "../auth/authUtils";
import NotificationService from "../services/notification.service";

class NotificationController {
  getListNotiByUser = async (req: RequestWithKeyStore, res: Response) => {
    new OK({
      message: "Success",
      metadata: await NotificationService.getListNotiByUser({
        userId: 1,
      }),
    }).sendResponse(res);
  };
}

export default new NotificationController();
