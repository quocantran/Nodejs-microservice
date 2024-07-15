"use strict";
import express, { NextFunction, Request, Response } from "express";
import { CREATED, OK } from "../core/success.response";

import ProductFactory from "../services/product.service";
import { IUser } from "../auth/authUtils";
import mongoose from "mongoose";
import SpuService from "../services/spu.service";
import SkuService from "../services/sku.service";

class ProductController {
  createProduct = async (req: IUser, res: Response, next: NextFunction) => {
    const { product_category } = req.body;

    new CREATED({
      message: "Created Success",
      metadata: await ProductFactory.createProduct(
        product_category,
        req.body,
        req.user
      ),
    }).sendResponse(res);
  };

  createSpu = async (req: IUser, res: Response, next: NextFunction) => {
    new CREATED({
      message: "Created Success",
      metadata: await SpuService.newSpu({
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).sendResponse(res);
  };

  findSpuById = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Success",
      metadata: await SpuService.findOneSpu(req.params.spu_id),
    }).sendResponse(res);
  };

  findSku = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Success",
      metadata: await SkuService.findSku(req.params.sku_id),
    }).sendResponse(res);
  };

  getProductsPaginated = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    new OK({
      message: "Success",
      metadata: await ProductFactory.getProductsPaginated(req.query),
    }).sendResponse(res);
  };

  searchProduct = async (req: Request, res: Response, next: NextFunction) => {
    new OK({
      message: "Success",
      metadata: await ProductFactory.searchProduct(req.query.search as string),
    }).sendResponse(res);
  };

  updateProduct = async (req: IUser, res: Response, next: NextFunction) => {
    const productId = req.params
      .productId as unknown as mongoose.Types.ObjectId;

    new OK({
      message: "Updated Success",
      metadata: await ProductFactory.updateProduct(
        productId,
        req.body,
        req.user
      ),
    }).sendResponse(res);
  };
}

export default new ProductController();
