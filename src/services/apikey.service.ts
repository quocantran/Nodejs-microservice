"use strict";

import ApiKey from "../models/apikey.model";

export const findApiKeyById = async (key: string) => {
  const objectKey = await ApiKey.findOne({ key, status: "active" }).lean();
  return objectKey;
};
