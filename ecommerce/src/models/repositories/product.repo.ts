"use strict";

import mongoose from "mongoose";
import { ProductModel } from "../product.model";
import { IProduct } from "../../interfaces";
import { BadRequestError } from "../../core/error.response";

export const getProductById = async (
  productId: mongoose.Schema.Types.ObjectId
) => {
  return await ProductModel.findOne({ _id: productId });
};

export const checkProduct = async (products: IProduct[]) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product._id);
      if (!foundProduct) {
        throw new BadRequestError("Product not found");
      }

      return {
        product_price: product.product_price,
        product_quantity: product.product_quantity,
        _id: product._id as string,
      };
    })
  );
};
