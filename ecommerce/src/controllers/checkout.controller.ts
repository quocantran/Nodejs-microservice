"use strict";

import { Request, Response } from "express";
import { OK } from "../core/success.response";
import CheckoutService from "../services/checkout.service";
import { IUser } from "../auth/authUtils";

class CheckoutController {
  checkoutReview = async (req: IUser, res: Response) => {
    new OK({
      message: "Success",
      metadata: await CheckoutService.checkoutReview({
        cartId: req.body.cartId,
        userId: req.user.userId.toString(),
        shopOrderIds: req.body.shopOrderIds,
      }),
    }).sendResponse(res);
  };
}

export default new CheckoutController();
