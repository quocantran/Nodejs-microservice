"use strict";

import { NextFunction, Request, Response } from "express";
import rbac from "./role.middleware";
import { UnauthorizedError } from "../core/error.response";
import RbacService from "../services/rbac.service";

interface PermissionQuery {
  [action: string]: (resource: string) => { granted: boolean };
}

export const grantAccess = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      rbac.setGrants(
        await RbacService.listRole({
          userId: 999,
        })
      );
      const roleName = req.query.role as string;
      if (!rbac.hasRole(roleName)) {
        throw new UnauthorizedError("Role not found");
      }
      const permission = (rbac.can(roleName) as unknown as PermissionQuery)[
        action
      ](resource);
      if (!permission.granted) {
        throw new UnauthorizedError("Permission denied");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
