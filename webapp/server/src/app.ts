import express from "express";
import cors from "cors";
import FirebaseController from "./firebase";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/create", async (req: express.Request, res: express.Response) => {
  try {
    const playersTable = await new FirebaseController("players").create({
      name: "Nickster",
      hash: "9bdc0d94292ee845372187165a0fff2e",
      class: "dps",
    });
    res.status(200).json(playersTable);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error!" });
  }
});

app.get("/hello-world", async (req: express.Request, res: express.Response) => {
  console.log("Hello, world!");
  res.json({ msg: "Hello, world!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Halo CE: Raids server listening on port ${PORT}`)
);
