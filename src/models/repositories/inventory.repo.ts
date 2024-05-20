import mongoose, { Types } from "mongoose";
import { Inventory } from "../../interfaces";
import InventoryModel from "../inventory.model";

export const insertInventory = async (inventory: Inventory) => {
  const { inven_productId, inven_shopId, inven_stock, inven_location } =
    inventory;
  return await InventoryModel.create({
    inven_productId,
    inven_shopId,
    inven_stock,
    inven_location,
  });
};

export const reservationInventory = async (
  productId: string,
  quantity: number,
  cartId: string
) => {
  const query = {
    inven_productId: new Types.ObjectId(productId),
    inven_stock: { $gte: quantity },
  };
  const update = {
    $push: {
      inven_reservations: {
        cartId,
        quantity,
        createdAt: new Date(),
      },
    },
    $inc: {
      inven_stock: -quantity,
    },
  };

  const options = {
    new: true,
    upsert: true,
  };

  return await InventoryModel.updateOne(query, update, options);
};
