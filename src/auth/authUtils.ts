import jwt from "jsonwebtoken";

export const createTokenPair = async (
  payload: any,
  publicKey: any,
  privateKey: any
) => {
  try {
    const accessToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });
    const refreshToken = jwt.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    jwt.verify(accessToken, publicKey, (err: any, decoded: any) => {
      if (err) {
        throw new Error("Access token is invalid");
      } else {
        console.log(decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {}
};
