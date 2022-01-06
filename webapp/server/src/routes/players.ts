import express from "express";

import FirebaseController from "../firebase";
import Response from "../lib/Response";
import {
  body,
  query,
  ValidationError,
  validationResult,
} from "express-validator";
import Password from "../lib/Password";
import Auth from "../lib/Auth";
import JWT from "../lib/JWT";
import { authorizeWithJWT, playerShouldExist } from "../middleware/players";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const MIN_RAND = 100000;
const MAX_RAND = 999999;

const generateCode = () =>
  Math.floor(Math.random() * (MAX_RAND - MIN_RAND) + MIN_RAND);

/* 
  Method: GET
  Resource: /players/authn
  Description: Authenticates a user.
*/

router.get(
  "/authenticate",
  [],
  async (req: express.Request, res: express.Response) => {
    try {
      const encodedBasicString = req.header("Basic");
      if (!encodedBasicString)
        return new Response()
          .addHttp(400)
          .addError({ tag: "", message: "String not found in header!" })
          .buildAndSend(res);

      const [name, password] = Buffer.from(encodedBasicString, "base64")
        .toString("utf-8")
        .split(":");

      const playerRecord = await new FirebaseController("players").get(name);

      if (!playerRecord)
        return new Response()
          .addHttp(404)
          .addError({ tag: "name", message: "This user does not exist!" })
          .buildAndSend(res);

      const isAuthenticated = await new Auth().N(
        password,
        playerRecord.password
      );

      if (!isAuthenticated) {
        return new Response()
          .addHttp(400)
          .addError({
            tag: "password",
            message:
              "The specified username or password does not match our records.",
          })
          .buildAndSend(res);
      }

      const jwt = new JWT().generateToken({
        name: playerRecord.owner,
        level: playerRecord.level,
      });

      return new Response()
        .addHttp(200)
        .addHumanMessage("Successfully authenticated.")
        .addData({ token: jwt })
        .buildAndSend(res);
    } catch (err) {
      return new Response()
        .addHttp(500)
        .addError({
          tag: "server_error",
          message: "An internal server error has occured.",
        })
        .addData(err)
        .buildAndSend(res);
    }
  }
);

/* 
  Method: POST
  Resource: /players/create
  Description: Creates a new player.
*/

router.post(
  "/create",
  [
    playerShouldExist(false),
    body("name")
      .isString()
      .isLength({ max: 11 })
      .matches(/^\d*[a-zA-Z][a-zA-Z\d]*$/)
      .withMessage(
        "Your name must be 11 characters max, and can ONLY contain numbers and/or case sensitive letters."
      ),
    body("password")
      .isString()
      .isLength({ min: 10 })
      .withMessage("Your password must contain at least 10 characters."),
  ],
  async (req: express.Request, res: express.Response) => {
    try {
      const { name, password } = req.body;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const response = new Response().addHttp(400);
        errors
          .array()
          .forEach((error) =>
            response.addError({ tag: error.param, message: error.msg })
          );

        return response.buildAndSend(res);
      }

      const newPlayer = {
        active_class_id: "dps",
        equipment_id: null,
        loadout: {
          primary_weapon_id: "assault_rifle",
          secondary_weapon_id: "magnum",
        },
        version: "qwertyuiop",
        collection: [
          "magnum",
          "assault_rifle",
          "chaingun",
          "plasma_rifle",
          "plasma_pistol",
          "shotgun",
          "smg",
        ],
        owner: name,
        password: await new Password().encrypt(password),
        hash: "",
        player_code: generateCode(),
        avatar: "master-chief",
        level: "player",
      };

      await new FirebaseController("players").create(newPlayer, name);

      return new Response()
        .addHttp(200)
        .addHumanMessage("Success")
        .addData(newPlayer)
        .buildAndSend(res);
    } catch (err) {
      return new Response()
        .addHttp(500)
        .addError({
          tag: "server_error",
          message: "An internal server error has occured.",
        })
        .addData(err)
        .buildAndSend(res);
    }
  }
);

/* 
  Method: GET
  Resource: /players/query
  Description: Query a player. See query object for query inputs. 
*/

router.get(
  "/query",
  [],
  async (req: express.Request, res: express.Response) => {
    try {
      const { active_class_id, name, page } = req.query;

      const query = {
        active_class_id,
        owner: name,
        page,
      };

      const results = await new FirebaseController("players").query(query);

      return new Response()
        .addHttp(200)
        .addHumanMessage("Success")
        .addData(results)
        .buildAndSend(res);
    } catch (err) {
      return new Response()
        .addHttp(500)
        .addError({
          tag: "server_error",
          message: "An internal server error has occured.",
        })
        .addData(err)
        .buildAndSend(res);
    }
  }
);

/* 
  Method: GET
  Resource: /players/get/:name
  Description: Look up the player by id (name).
*/

router.get(
  "/get/:id",
  [playerShouldExist(true), authorizeWithJWT("read")],
  async (req: express.Request, res: express.Response) => {
    try {
      const name = req.params.id;

      const result = await new FirebaseController("players").get(name);
      // const result = req.body.record;

      return new Response()
        .addHttp(200)
        .addHumanMessage("Success")
        .addData(result)
        .buildAndSend(res);
    } catch (err) {
      return new Response()
        .addHttp(500)
        .addError({
          tag: "server_error",
          message: "An internal server error has occured.",
        })
        .addData(err)
        .buildAndSend(res);
    }
  }
);

/* 
  Method: PUT
  Resource: /players/update/:name
  Description: Update a player's data.
*/

router.put(
  "/update/:id",
  [playerShouldExist(true), authorizeWithJWT("write")],
  async (req: express.Request, res: express.Response) => {
    let newLoadout = undefined;

    //TODO: Refactor loadouts to be customizable.
    if (req.body.active_class_id) {
      const newClass = req.body.active_class_id;
      switch (newClass) {
        case "dps": {
          newLoadout = {
            primary_weapon_id: "assault_rifle",
            secondary_weapon_id: "magnum",
          };

          break;
        }

        case "medic": {
          newLoadout = {
            primary_weapon_id: "plasma_rifle",
            secondary_weapon_id: "plasma_pistol",
          };

          break;
        }

        case "ammo": {
          newLoadout = {
            primary_weapon_id: "chaingun",
            secondary_weapon_id: "magnum",
          };

          break;
        }

        case "tank": {
          newLoadout = {
            primary_weapon_id: "shotgun",
            secondary_weapon_id: "smg",
          };

          break;
        }

        default:
          newLoadout = {
            primary_weapon_id: "assault_rifle",
            secondary_weapon_id: "magnum",
          };
      }
    }

    try {
      const name = req.params.id;

      const updates = {
        active_class_id: req.body.active_class_id,
        equipment_id: req.body.equipment_id,
        loadout: newLoadout,
        version: uuidv4(),
        collection: req.body.collection,
        password: !!req.body.password
          ? await new Password().encrypt(req.body.password)
          : undefined,
        hash: req.body.hash,
      };

      const updatedRecord = await new FirebaseController("players").update(
        name,
        updates
      );

      return new Response()
        .addHttp(200)
        .addHumanMessage("Success")
        .addData(updatedRecord)
        .buildAndSend(res);
    } catch (err) {
      return new Response()
        .addHttp(500)
        .addError({
          tag: "server_error",
          message: "An internal server error has occured.",
        })
        .addData(err)
        .buildAndSend(res);
    }
  }
);

/* 
  Method: DELETE
  Resource: /players/remove
  Description: Delete a player from the database.
*/

router.delete(
  "/remove",
  [],
  async (req: express.Request, res: express.Response) => {
    return new Response()
      .addHttp(200)
      .addHumanMessage("Work in progress!")
      .buildAndSend(res);
  }
);

export { router };
