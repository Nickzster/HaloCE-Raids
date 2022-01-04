import jwt from "jsonwebtoken";
import { IAuthData as IJWTPayload } from "./Auth";
import { getConfigItem } from "../config.temp";

class JWT {
  public generateToken(
    payload: IJWTPayload,
    secret = getConfigItem("jwt_secret")
  ) {
    try {
      return jwt.sign(payload, secret, { expiresIn: 36000 });
    } catch (err) {
      throw err;
    }
  }
  public verifyToken(token: string, secret = getConfigItem("jwt_secret")) {
    try {
      return jwt.verify(token, secret);
    } catch (err) {
      throw err;
    }
  }
}

export default JWT;
