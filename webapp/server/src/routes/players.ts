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

const router = express.Router();

const MIN_RAND = 100000;
const MAX_RAND = 999999;

const generateCode = () =>
  Math.floor(Math.random() * (MAX_RAND - MIN_RAND) + MIN_RAND);

router.post(
  "/create",
  [
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

      const playerExists = await new FirebaseController("players").get(name);

      if (!!playerExists)
        return new Response()
          .addHttp(400)
          .addError({ tag: "name", message: "This user already exists!" })
          .buildAndSend(res);

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
        name,
        password: await new Password().encrypt(password),
        hash: "",
        player_code: generateCode(),
        avatar: "master-chief",
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

router.get(
  "/query",
  [],
  async (req: express.Request, res: express.Response) => {
    try {
      const { active_class_id, name, page } = req.query;

      const query = {
        active_class_id,
        name,
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

router.get(
  "/query/:name",
  [],
  async (req: express.Request, res: express.Response) => {
    try {
      const name = req.params.name;

      const result = await new FirebaseController("players").get(name);

      if (!!result)
        return new Response()
          .addHttp(200)
          .addHumanMessage("Success")
          .addData(result)
          .buildAndSend(res);

      return new Response()
        .addHttp(404)
        .addError({
          tag: "not_found",
          message: "The requested resource could not be found.",
        })
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

router.put(
  "/update/:name",
  [],
  async (req: express.Request, res: express.Response) => {
    //TODO: Needs to be an authenticated/authorized route.

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
      const name = req.params.name;

      const updates = {
        active_class_id: req.body.active_class_id,
        equipment_id: req.body.equipment_id,
        loadout: newLoadout,
        version: "qwertyuiop",
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

      if (!updatedRecord)
        return new Response()
          .addHttp(200)
          .addHumanMessage("No changes were made.")
          .buildAndSend(res);

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
