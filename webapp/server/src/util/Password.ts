import bcrypt from "bcryptjs";

class Password {
  public async encrypt(password: string) {
    try {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(password, salt);
    } catch (err) {
      throw err;
    }
  }
  public async compare({
    password,
    encrypted,
  }: {
    password: string;
    encrypted: string;
  }): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }
}

export default Password;
