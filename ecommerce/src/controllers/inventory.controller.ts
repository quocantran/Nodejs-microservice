"use strict";

import { Request, Response } from "express";
import { OK } from "../core/success.response";
import { IUser } from "../auth/authUtils";
import InventoryService from "../services/inventory.service";

class InventoryController {
  addStockToInventory = async (req: Request, res: Response) => {
    new OK({
      message: "Success",
      metadata: await InventoryService.addStockToInventory(req.body),
    }).sendResponse(res);
  };
}

export default new InventoryController();
