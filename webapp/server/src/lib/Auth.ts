import Password from "./Password";

export interface IAuthData {
  name: string;
  level: "banned" | "player" | "admin";
}

class Auth {
  public constructor(user: IAuthData) {}

  public async N(
    playerRecord: any,
    plaintextPassword: string
  ): Promise<IAuthData | null> {
    try {
      const same = await new Password().compare({
        password: plaintextPassword,
        encrypted: playerRecord.password,
      });
      if (same)
        return {
          name: playerRecord.name,
          level: playerRecord.level,
        };
      return null;
    } catch (error) {
      return null;
    }
  }

  public async Z(
    user: IAuthData,
    action: "write" | "read",
    recordToAccess: any
  ): Promise<boolean> {
    if (user.level === "banned") return false;
    if (user.level === "admin") return true;
    if (recordToAccess["readable"] === false) return false;
    if (action === "read") return true;
    if (action === "write" && recordToAccess["name"] === user.name) return true;
    return false;
  }
}

export default Auth;
