import Password from "./Password";

export interface IAuthData {
  name: string;
  level: "banned" | "player" | "admin";
}

class Auth {
  public constructor() {}

  public async N(
    plaintextPassword: string,
    encryptedPassword: string
  ): Promise<boolean> {
    try {
      return await new Password().compare({
        password: plaintextPassword,
        encrypted: encryptedPassword,
      });
    } catch (error) {
      return false;
    }
  }

  public Z(
    user: IAuthData,
    action: "write" | "read",
    recordToAccess: any
  ): boolean {
    // User level checks.
    if (user.level === "banned") return false;
    if (user.level === "admin") return true;
    // Ensure records belong to players.
    if (!recordToAccess.owner || recordToAccess.owner === "all!") return false;
    if (
      (action === "read" || action === "write") &&
      recordToAccess.owner === user.name
    )
      return true;
    return false;
  }
}

export default Auth;
