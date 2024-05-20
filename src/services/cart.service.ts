"use strict";

import { IProduct } from "../interfaces";
import CartModel from "../models/cart.model";
import { getProductById } from "../models/repositories/product.repo";
import { BadRequestError } from "../core/error.response";

class CartService {
  static async createCart(userId: string, product: IProduct) {
    const query = {
      cart_userId: userId,
    };
    const updateOrInsert = {
      $addToSet: {
        cart_products: product,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    const cart = await CartModel.findOneAndUpdate(
      query,
      updateOrInsert,
      options
    );
    return cart;
  }

  static async updateCartQuantity(userId: string, product: IProduct) {
    const { _id, product_quantity } = product;
    const query = {
      cart_userId: userId,
      "cart_products._id": _id,
    };
    const update = {
      $inc: {
        "cart_products.$.product_quantity": product_quantity,
      },
    };

    const options = {
      new: true,
    };
    const cart = await CartModel.findOneAndUpdate(query, update, options);
    return cart;
  }

  static async addToCart(userId: string, product: IProduct) {
    const userCart = await CartModel.findOne({ cart_userId: userId });

    if (!userCart) {
      return await CartService.createCart(userId, product);
    }

    if (!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    if (userCart.cart_products.some((p) => p._id == product._id)) {
      return await CartService.updateCartQuantity(userId, product);
    }

    return await CartService.createCart(userId, product);
  }

  static async updateCart(userId: string, product: IProduct) {
    const { _id, product_quantity, product_old_quantity } = product;
    const userCart = await CartModel.findOne({ cart_userId: userId });
    const foundProduct = await getProductById(_id);

    if (!foundProduct) {
      throw new BadRequestError("Product not found");
    }

    if (!userCart.cart_products.some((p) => p._id == _id)) {
      throw new BadRequestError("Product not found in cart");
    }

    if (product_quantity <= 0) {
      return await CartService.deleteUserCart(userId, _id);
    }

    product.product_quantity = ((product_quantity as number) -
      product_old_quantity) as number;

    return await CartService.updateCartQuantity(userId, product);
  }

  static async deleteUserCart(userId: string, productId: string) {
    const query = {
      cart_userId: userId,
      cart_status: "active",
    };
    const update = {
      $pull: {
        cart_products: {
          _id: productId,
        },
      },
    };

    const options = {
      new: true,
    };

    const deleteCart = await CartModel.updateOne(query, update, options);
    return deleteCart;
  }

  static async getListUserCart(userId: string) {
    return await CartModel.findOne({
      cart_userId: userId,
      cart_status: "active",
    }).lean();
  }
}

export default CartService;
