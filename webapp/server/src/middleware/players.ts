import express from "express";
import FirebaseController from "../firebase";
import Auth from "../lib/Auth";
import JWT from "../lib/JWT";
import Response from "../lib/Response";

const AUTHN_HEADER_KEY = "x-haloceraids-token";

export const playerShouldExist =
  (shouldExist: boolean) =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    let name = req.params.id;

    //First check to see if name is located in params.
    if (!name) name = req.body.name;

    //Second check to see if name is located in body.
    if (!name)
      return new Response()
        .addHttp(400)
        .addError({ tag: "name", message: "You must specify a name!" })
        .buildAndSend(res);

    const playerRecord = await new FirebaseController("players").get(name);

    if (!playerRecord && shouldExist) {
      return new Response()
        .addHttp(404)
        .addError({ tag: "name", message: "This user does not exist." })
        .buildAndSend(res);
    }

    if (playerRecord && !shouldExist) {
      return new Response()
        .addHttp(400)
        .addError({ tag: "name", message: "This user already exists!" })
        .buildAndSend(res);
    }

    req.body.record = playerRecord;

    return next();
  };

export const authorizeWithJWT =
  (action: "write" | "read") =>
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const jwt = req.header(AUTHN_HEADER_KEY);

    if (!jwt)
      return new Response()
        .addHttp(401)
        .addError({ tag: "", message: "Failed to authenticate via token." })
        .buildAndSend(res);

    const decoded: any = new JWT().verifyToken(jwt);

    if (!decoded)
      return new Response()
        .addHttp(401)
        .addError({ tag: "", message: "Bad token" })
        .buildAndSend(res);

    req.body.jwt = decoded;

    const { name, level } = decoded;

    let record = req.body.record;

    if (!record)
      record = await new FirebaseController("players").get(req.params.id);

    if (!record)
      return new Response()
        .addHttp(404)
        .addError({ tag: "", message: "Record not found" })
        .buildAndSend(res);

    const isAuthorized = new Auth().Z(
      {
        name,
        level,
      },
      action,
      record
    );

    if (!isAuthorized)
      return new Response()
        .addHttp(401)
        .addError({
          tag: "name",
          message: "You are not authorized to perform this action!",
        })
        .buildAndSend(res);
    return next();
  };
