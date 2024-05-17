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
