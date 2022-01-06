import axios from "axios";
import { configureApp, startApp } from "../lib/App";
import FirebaseController from "../firebase";
import {
  get,
  getAll,
  create,
  query,
  update,
} from "../firebase/__mocks__/players";
import { Server } from "http";

jest.mock("../firebase", () =>
  jest.fn().mockImplementation(() => ({
    getAll,
    get,
    query,
    create,
    update,
  }))
);

const createBasicString = (name: string, password: string) =>
  Buffer.from(`${name}:${password}`, "utf-8").toString("base64");

const authenticate = async (name: string, password: string) => {
  try {
    const encodedAuthString = Buffer.from(
      `${name}:${password}`,
      "utf-8"
    ).toString("base64");

    const response = await axios.get(
      "http://localhost:5000/players/authenticate",
      {
        headers: {
          Basic: encodedAuthString,
        },
      }
    );

    return response.data.data.token;
  } catch (err) {
    return null;
  }
};

describe("Player route tests", () => {
  let server: Server;
  beforeAll(async () => {
    configureApp();
    server = startApp();
    // await new Promise((resolve, reject) => {
    //   setTimeout(() => resolve("bar"), 1000 * 1);
    // });
  });

  afterAll(() => {
    server.close();
  });

  it("Should be able to fetch a single player", async () => {
    try {
      const name = "Nickster";
      const password = "foobarfoobaz";

      const jwt = await authenticate(name, password);

      expect(jwt).toBeDefined();

      const response: any = await axios.get(
        `http://localhost:5000/players/get/${name}`,
        { headers: { "x-haloceraids-token": jwt } }
      );

      const playerData = response.data.data;

      expect(playerData).toBeDefined();
      expect(playerData.owner).toBe("Nickster");
      expect(playerData.active_class_id).toBe("dps");
      expect(playerData.avatar).toBe("master-chief");
      expect(playerData.player_code).toBe(123456);
    } catch (err: any) {
      if (err.response?.data?.failure?.error[0]) fail(err.response.data);
      fail(err);
    }
  });

  it("Should fail to look up one player from a different player account.", async () => {
    try {
      const name = "Bungie";
      const password = "foobarfoobaz";

      const jwt = await authenticate(name, password);

      expect(jwt).toBeDefined();

      const response: any = await axios.get(
        `http://localhost:5000/players/get/Ender`,
        { headers: { "x-haloceraids-token": jwt } }
      );

      const playerData = response.data.data;

      fail(playerData);
    } catch (err: any) {
      expect(err.response.data.failure.error[0]).toBeDefined();
      expect(err.response.data.failure.error[0].message).toBe(
        "You are not authorized to perform this action!"
      );
    }
  });

  it("Should fail to fetch non-existant player", async () => {
    try {
      const response: any = await axios.get(
        "http://localhost:5000/players/get/xpfe5zrm"
      );

      fail("got response when expected to fail!");
    } catch (err: any) {
      expect(err.response.data.http).toBe(404);
      expect(err.response.data.failure.error[0].message).toBe(
        "This user does not exist."
      );
    }
  });

  it("Should fail to create duplicate player", async () => {
    try {
      const response: any = await axios.post(
        "http://localhost:5000/players/create",
        {
          name: "Nickster",
          password: "12345678910",
        }
      );
    } catch (err: any) {
      expect(err.response.data.failure).toBeDefined();
      expect(err.response.data.failure.error[0].message).toBe(
        "This user already exists!"
      );
      expect(err.response.data.failure.error[0].tag).toBe("name");
    }
  });

  it("Should fail to create a player with a bad password", async () => {
    try {
      const response: any = await axios.post(
        "http://localhost:5000/players/create",
        {
          name: "Zack",
          password: "123456",
        }
      );
    } catch (err: any) {
      expect(err.response.data.failure).toBeDefined();
      expect(err.response.data.failure.error[0].message).toBe(
        "Your password must contain at least 10 characters."
      );
      expect(err.response.data.failure.error[0].tag).toBe("password");
    }
  });

  it("Should succeed in creating a new player", async () => {
    try {
      const response: any = await axios.post(
        "http://localhost:5000/players/create",
        {
          name: "Zack",
          password: "12345678910",
        }
      );

      const playerData = response.data.data;

      expect(playerData.owner).toBe("Zack");
      expect(playerData.avatar).toBe("master-chief");
    } catch (err: any) {
      if (err.response?.data?.failure?.error[0]) fail(err.response.data);
      fail(err);
    }
  });

  it("Should be able to query for players", async () => {
    try {
      const response: any = await axios.get(
        "http://localhost:5000/players/query?active_class_id=medic"
      );

      const playerData = response.data.data[0];

      expect(playerData).toBeDefined();
      expect(playerData.owner).toBe("Ender");
      expect(playerData.active_class_id).toBe("medic");
      expect(playerData.avatar).toBe("master-chief");
      expect(playerData.player_code).toBe(123456);
    } catch (err: any) {
      if (err.response?.data?.failure?.error[0]) fail(err.response.data);
      fail(err);
    }
  });

  it("Authentication should fail due to bad credentials", async () => {
    try {
      const name = "Ender";
      const password = "foobarfooba";

      const encodedAuthString = createBasicString(name, password);

      const response = await axios.get(
        "http://localhost:5000/players/authenticate",
        {
          headers: {
            Basic: encodedAuthString,
          },
        }
      );
    } catch (err: any) {
      expect(err.response.data.http).toBe(400);
      expect(err.response.data.failure).toBeDefined();
      expect(err.response.data.failure.error[0]).toBeDefined();
      expect(err.response.data.failure.error[0].message).toBe(
        "The specified username or password does not match our records."
      );
    }
  });

  it("Should fail to update non-existant player", async () => {
    try {
      const name = "xpfe5zrm";
      const password = "foobarbaz";

      const encodedAuthString = createBasicString(name, password);

      const response = await axios.put(
        `http://localhost:5000/players/update/${name}`,
        {
          hash: "abcdef",
        },
        { headers: { Basic: encodedAuthString } }
      );
    } catch (err: any) {
      expect(err.response.data.http).toBe(404);
      expect(err.response.data.failure.error[0].message).toBe(
        "This user does not exist."
      );
    }
  });

  it("Should be able to update a player's record", async () => {
    try {
      const name = "Bungie";
      const password = "foobarfoobaz";

      const jwt = await authenticate(name, password);

      const response = await axios.put(
        `http://localhost:5000/players/update/${name}`,
        {
          hash: "abcdef",
        },
        { headers: { "x-haloceraids-token": jwt } }
      );

      const responseData = response.data;

      expect(responseData.http).toBe(200);
      expect(responseData.success.human).toBe("Success");
      expect(responseData.data.hash).toBe("abcdef");
    } catch (err: any) {
      if (err.response?.data?.failure?.error[0])
        fail(JSON.stringify(err.response.data, null, 2));
      fail(err);
    }
  });

  it("Should fail to update non-owned record", async () => {
    try {
      const name = "Bungie";
      const password = "foobarfoobaz";

      const jwt = await authenticate(name, password);

      const response = await axios.put(
        `http://localhost:5000/players/update/Ender`,
        {
          hash: "abcdef",
        },
        { headers: { "x-haloceraids-token": jwt } }
      );

      const responseData = response.data;

      fail("Expected to fail");
    } catch (err: any) {
      expect(err.response.data.failure.error[0].message).toBe(
        "You are not authorized to perform this action!"
      );
    }
  });

  it("Authentication should fail due non-existant user", async () => {
    try {
      const name = "xpfe5zrm";
      const password = "foobarfooba";

      const encodedAuthString = Buffer.from(
        `${name}:${password}`,
        "utf-8"
      ).toString("base64");

      const response = await axios.get(
        "http://localhost:5000/players/authenticate",
        {
          headers: {
            Basic: encodedAuthString,
          },
        }
      );
    } catch (err: any) {
      expect(err.response.data.http).toBe(404);
      expect(err.response.data.failure).toBeDefined();
      expect(err.response.data.failure.error[0]).toBeDefined();
      expect(err.response.data.failure.error[0].message).toBe(
        "This user does not exist!"
      );
    }
  });

  it("Authentication should be successful", async () => {
    try {
      const name = "Ender";
      const password = "foobarfoobaz";

      const encodedAuthString = Buffer.from(
        `${name}:${password}`,
        "utf-8"
      ).toString("base64");

      const response = await axios.get(
        "http://localhost:5000/players/authenticate",
        {
          headers: {
            Basic: encodedAuthString,
          },
        }
      );

      const responseData = response.data;

      expect(responseData.http).toBe(200);
      expect(responseData.success.human).toBe("Successfully authenticated.");
      expect(responseData.data.token).toBeDefined();
    } catch (err: any) {
      if (err.response?.data?.failure?.error[0]) fail(err.response.data);
      fail(err);
    }
  });
});
