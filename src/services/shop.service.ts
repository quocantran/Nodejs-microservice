"use strict";

import Shop from "../models/shop.model";

export const findByEmail = async ({
  email,
  select = {
    email: 1,
    password: 1,
    roles: 1,
    name: 1,
  },
}: {
  email: string;
  select?: any;
}) => {
  const shop = await Shop.findOne({ email }).select(select).lean();
  return shop;
};
