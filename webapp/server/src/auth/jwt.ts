import jwt from "jsonwebtoken";

const JWTSecret = "REPLACE_ME_NOW";

const AdminJWTSecret = "REPLACE_ME_NOW";

export interface IJWTPayload {
  id: string;
}

class JWT {
  // forgiving duplication here for now.
  public async generateAdminToken(
    payload: IJWTPayload,
    secret = AdminJWTSecret
  ) {
    try {
      return await jwt.sign(payload, secret, { expiresIn: 3600 });
    } catch (err) {
      throw err;
    }
  }
  public async generateToken(payload: IJWTPayload, secret = JWTSecret) {
    try {
      return await jwt.sign(payload, secret, { expiresIn: 36000 });
    } catch (err) {
      throw err;
    }
  }
  public async verifyToken(token: string, secret = JWTSecret) {
    try {
      return await jwt.verify(token, secret);
    } catch (err) {
      throw err;
    }
  }
}

export default JWT;
