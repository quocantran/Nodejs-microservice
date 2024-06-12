"use strict";

import { BadRequestError } from "../core/error.response";
import { IOrder } from "../interfaces";
import OrderModel from "../models/order.model";
import { findCartById } from "../models/repositories/cart.repo";
import { checkProduct } from "../models/repositories/product.repo";
import { acquireLock, releaseLock } from "./redis.service";

interface IOrderByUser {
  shopOrderIds: any;
  userId: string;
  cartId: string;
  userPayment: any;
  userAddress: any;
}

class CheckoutService {
  static async checkoutReview({
    cartId,
    userId,
    shopOrderIds = [],
  }: {
    cartId: string;
    userId: string;
    shopOrderIds: [];
  }) {
    const foundCart = await findCartById(cartId);
    if (!foundCart) {
      throw new BadRequestError("Cart not found");
    }

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
    };

    const shopOrderIdsNew: IOrder[] = [];

    for (let i = 0; i < shopOrderIds.length; i++) {
      const { shopId, products } = shopOrderIds[i];

      const checkProductByServer = await checkProduct(products);

      const checkoutPrice = checkProductByServer.reduce(
        (acc: number, product: any) => {
          return acc + product.product_price * product.product_quantity;
        },
        0
      );

      checkoutOrder.totalPrice += checkoutPrice;
      const itemCheckOut = {
        shopId: shopId as string,
        products: checkProductByServer,
        totalPrice: checkoutPrice,
      };
      shopOrderIdsNew.push(itemCheckOut);
    }

    return {
      shopOrderIds,
      shopOrderIdsNew,
      checkoutOrder,
    };
  }

  static async orderByUser(payload: IOrderByUser) {
    const { shopOrderIds, userId, cartId, userPayment, userAddress } = payload;
    const { shopOrderIdsNew, checkoutOrder } = await this.checkoutReview({
      cartId,
      userId,
      shopOrderIds,
    });
    const acquireProduct = [];
    const products = shopOrderIdsNew.flatMap((order) => order.products);
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const keyLock = await acquireLock(
        product._id,
        product.product_quantity,
        cartId
      );
      acquireProduct.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }
    if (acquireProduct.includes(false)) {
      throw new BadRequestError("Some products are out of stock!");
    }

    const newOrder = await OrderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: userAddress,
      order_payment: userPayment,
      order_products: shopOrderIdsNew,
    });

    if (newOrder) {
    }

    return newOrder;
  }
}

export default CheckoutService;
