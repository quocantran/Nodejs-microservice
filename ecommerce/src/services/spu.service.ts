"use strict";

import { BadRequestError } from "../core/error.response";
import { IProduct } from "../interfaces";
import { Spu } from "../models/spu.model";
import { randomProductId, removeInfoData } from "../utils";
import { findByShopId } from "./shop.service";
import SkuService from "./sku.service";

class SpuService {
  static newSpu = async (data: IProduct) => {
    const {
      product_id,
      product_name,
      product_thumb,
      product_description,
      product_price,
      product_category,
      product_shop,
      product_quantity,
      product_attributes,
      product_variations,
      sku_list,
    } = data;

    const shop = await findByShopId({ id: product_shop });
    if (!shop) {
      throw new BadRequestError("Shop not found");
    }

    const spu = await Spu.create({
      ...data,
      product_id: randomProductId().toString(),
    });

    if (spu && sku_list.length) {
      // create sku
      return await SkuService.newSku({
        spu_id: spu.product_id,
        sku_list,
      });
    }
  };

  static findOneSpu = async (spu_id: string) => {
    const spu = await Spu.findOne({
      product_id: spu_id,
    }).lean();

    if (!spu) {
      throw new BadRequestError("Spu not found");
    }
    const skus = await SkuService.getAllSku(spu_id);

    return {
      spu_info: removeInfoData({
        fileds: ["_id", "__v", "createdAt"],
        object: spu,
      }),
      sku_info: skus,
    };
  };
}

export default SpuService;
