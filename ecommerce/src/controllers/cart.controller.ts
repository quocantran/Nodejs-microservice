"use strict";

import { IUser } from "../auth/authUtils";
import { OK } from "../core/success.response";
import CartService from "../services/cart.service";
import { Request, Response } from "express";

class CartController {
  getListCartUser = async (req: IUser, res: Response) => {
    new OK({
      message: "Success",
      metadata: await CartService.getListUserCart(req.user.userId.toString()),
    }).sendResponse(res);
  };

  addToCart = async (req: IUser, res: Response) => {
    const { product } = req.body;
    new OK({
      message: "Success",
      metadata: await CartService.addToCart(
        req.user.userId.toString(),
        product
      ),
    }).sendResponse(res);
  };

  updateCart = async (req: IUser, res: Response) => {
    const { product } = req.body;

    new OK({
      message: "Success",
      metadata: await CartService.updateCart(
        req.user.userId.toString(),
        product
      ),
    }).sendResponse(res);
  };

  deleteCart = async (req: IUser, res: Response) => {
    const { product } = req.body;
    new OK({
      message: "Success",
      metadata: await CartService.deleteUserCart(
        req.user.userId.toString(),
        product._id
      ),
    }).sendResponse(res);
  };
}

export default new CartController();
