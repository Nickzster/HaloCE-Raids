import axios from "axios";
import { configureApp, startApp } from "../util/App";
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
    const response: any = await axios.get(
      "http://localhost:5000/players/query/Nickster"
    );

    const playerData = response.data.data;

    expect(playerData).toBeDefined();
    expect(playerData.name).toBe("Nickster");
    expect(playerData.active_class_id).toBe("dps");
    expect(playerData.avatar).toBe("master-chief");
    expect(playerData.player_code).toBe(123456);
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

      expect(playerData.name).toBe("Zack");
      expect(playerData.avatar).toBe("master-chief");
    } catch (err: any) {
      console.log(err);
      fail("Did not expect for request to fail.");
    }
  });

  it("Should be able to query for players", async () => {
    try {
      const response: any = await axios.get(
        "http://localhost:5000/players/query?active_class_id=medic"
      );

      const playerData = response.data.data;

      expect(playerData).toBeDefined();
      expect(playerData.name).toBe("Ender");
      expect(playerData.active_class_id).toBe("medic");
      expect(playerData.avatar).toBe("master-chief");
      expect(playerData.player_code).toBe(123456);
    } catch (err) {}
  });
});
