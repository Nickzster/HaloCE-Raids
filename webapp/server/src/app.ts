import express from "express";
import cors from "cors";
import { Players, Items, Tags, Bosses, Events } from "./routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/events", Events);
app.use("/players", Players);
app.use("/items", Items);
app.use("/tags", Tags);
app.use("/bosses", Bosses);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Halo CE: Raids server listening on port ${PORT}`)
);
