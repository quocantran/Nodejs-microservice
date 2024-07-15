"use strict";

import User from "../user.model";

const createUser = async ({
  user_id = 0,
  user_name = "",
  user_email = "",
  user_password = "",
  user_role = "",
  user_slug = "",
}) => {
  const newUser = await User.create({
    user_id,
    user_name,
    user_email,
    user_password,
    user_role,
    user_slug,
  });

  return newUser;
};

export { createUser };
