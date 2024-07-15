"use strict";

import { BadRequestError } from "../core/error.response";
import { IProduct } from "../interfaces";
import Sku from "../models/sku.model";
import { Spu } from "../models/spu.model";
import { randomProductId, removeInfoData } from "../utils";
import { findByShopId } from "./shop.service";

class SkuService {
  static newSku = async ({
    spu_id,
    sku_list,
  }: {
    spu_id: string;
    sku_list: Array<any>;
  }) => {
    const converSkuList = sku_list.map((sku) => {
      return {
        ...sku,
        product_id: spu_id,
        sku_id: `${spu_id}.${randomProductId().toString()}`,
      };
    });

    const skus = await Sku.create(converSkuList);
    return skus;
  };

  static findSku = async (sku_id: string) => {
    const sku = await Sku.findOne({
      sku_id,
    }).lean();

    if (!sku) {
      throw new BadRequestError("Sku not found");
    }

    return removeInfoData({
      fileds: ["_id", "__v", "createdAt"],
      object: sku,
    });
  };

  static getAllSku = async (spu_id: string) => {
    const skus = await Sku.find({
      product_id: spu_id,
    }).lean();

    return skus.map((sku) =>
      removeInfoData({
        fileds: ["_id", "__v", "createdAt"],
        object: sku,
      })
    );
  };
}

export default SkuService;
