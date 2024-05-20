"use strict";

import { BadRequestError } from "../core/error.response";
import InventoryModel from "../models/inventory.model";
import { getProductById } from "../models/repositories/product.repo";

class InventoryService {
  static async addStockToInventory(payload: any) {
    const { stock, productId, shopId, location } = payload;
    const product = await getProductById(productId);
    if (!product) {
      throw new BadRequestError("Product not found");
    }
    const query = {
      inven_shopId: shopId,
      inven_productId: productId,
    };

    const update = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };
    const options = {
      upsert: true,
      new: true,
    };
    const inventory = await InventoryModel.findOneAndUpdate(
      query,
      update,
      options
    );
    return inventory;
  }
}

export default InventoryService;
