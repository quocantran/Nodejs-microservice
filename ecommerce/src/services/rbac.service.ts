import { BadRequestError } from "../core/error.response";
import Resource from "../models/resource.model";
import Role from "../models/role.model";

class RbacService {
  static createResource = async (
    name = "profile",
    slug: string,
    description: string
  ) => {
    const isExist = await Resource.findOne({
      src_name: name,
    });

    if (isExist) {
      return new BadRequestError("Resource already exist");
    }

    const newResource = await Resource.create({
      src_name: name,
      src_slug: slug,
      src_description: description,
    });
    return newResource;
  };

  static listResource = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    const resources = await Resource.aggregate([
      {
        $project: {
          _id: 0,
          name: "$src_name",
          slug: "$src_slug",
          description: "$src_description",
          resourceId: "$_id",
          createdAt: 1,
        },
      },
    ])
      .limit(+limit)
      .sort({ createdAt: -1 })
      .skip(+offset);
    return resources;
  };

  static createRole = async ({
    name = "shop",
    slug = "s00001",
    description = "",
    grants = [],
  }) => {
    const isExist = await Role.findOne({
      role_name: name,
    }).lean();
    if (isExist) {
      return new BadRequestError("Role already exist");
    }

    const newRole = await Role.create({
      role_name: name,
      role_slug: slug,
      role_description: description,
      role_grants: grants,
    });
    return newRole;
  };

  static listRole = async ({
    userId = 0,
    limit = 30,
    offset = 0,
    search = "",
  }) => {
    const roles = await Role.aggregate([
      {
        $unwind: "$role_grants",
      },
      {
        $lookup: {
          from: "resources",
          localField: "role_grants.resource",
          foreignField: "_id",
          as: "resource",
        },
      },
      {
        $unwind: "$resource",
      },
      {
        $unwind: "$role_grants.actions",
      },
      {
        $unwind: "$role_grants.attributes",
      },
      {
        $project: {
          _id: 0,
          role: "$role_name",
          resource: "$resource.src_name",
          action: "$role_grants.actions",
          attributes: "$role_grants.attributes",
        },
      },
    ]);
    return roles;
  };
}

export default RbacService;
