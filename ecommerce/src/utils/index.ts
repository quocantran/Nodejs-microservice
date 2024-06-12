"use strict";

import lodash from "lodash";

const _ = lodash;

export const getInfoData = ({ fileds = [], object = {} }) => {
  return _.pick(object, fileds);
};
