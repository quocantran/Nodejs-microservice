"use strict";

import CartModel from "../cart.model";

export const findCartById = async (cartId: string) => {
  return await CartModel.findOne({ _id: cartId, cart_status: "active" });
};
