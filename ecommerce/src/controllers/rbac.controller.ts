"use strict";

import { CREATED, OK } from "../core/success.response";
import { Request, Response } from "express";
import RbacService from "../services/rbac.service";

class RbacController {
  createRole = async (req: Request, res: Response) => {
    new CREATED({
      message: "create role",
      metadata: await RbacService.createRole(req.body),
    }).sendResponse(res);
  };

  createResource = async (req: Request, res: Response) => {
    const { name, slug, description } = req.body;
    new CREATED({
      message: "create resource",
      metadata: await RbacService.createResource(name, slug, description),
    }).sendResponse(res);
  };

  getResources = async (req: Request, res: Response) => {
    new OK({
      message: "get resources",
      metadata: await RbacService.listResource(req.query),
    }).sendResponse(res);
  };
  getRoles = async (req: Request, res: Response) => {
    new OK({
      message: "get roles",
      metadata: await RbacService.listRole(req.query),
    }).sendResponse(res);
  };
}

export default new RbacController();
