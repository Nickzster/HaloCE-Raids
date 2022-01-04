import express from "express";
import Response from "../lib/Response";

const router = express.Router();

router.post(
  "/create",
  [],
  async (req: express.Request, res: express.Response) => {
    return new Response()
      .addHttp(200)
      .addHumanMessage("Work in progress!")
      .buildAndSend(res);
  }
);

router.get(
  "/retrieve",
  [],
  async (req: express.Request, res: express.Response) => {
    return new Response()
      .addHttp(200)
      .addHumanMessage("Work in progress!")
      .buildAndSend(res);
  }
);

router.get(
  "/retrieve/:id",
  [],
  async (req: express.Request, res: express.Response) => {
    return new Response()
      .addHttp(200)
      .addHumanMessage("Work in progress!")
      .buildAndSend(res);
  }
);

router.put(
  "/update",
  [],
  async (req: express.Request, res: express.Response) => {
    return new Response()
      .addHttp(200)
      .addHumanMessage("Work in progress!")
      .buildAndSend(res);
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
