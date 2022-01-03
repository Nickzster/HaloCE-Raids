import cors from "cors";
import fs from "fs";
import path from "path";

import { bootstrap } from "./bootstrap";
import BuildConfig from "./lib/BuildConfig";
import PostGameProcessor from "./lib/PostGameProcessor";

(function main() {
  const args = process.argv;
  //1. Handle Args
  args.forEach((arg) => {
    if (arg === "--bootstrap-players") {
      console.log("Bootstrapping players...");
      bootstrap("players")
        .then(() => {
          console.log(`(${arg}) success`);
          process.exit(0);
        })
        .catch(() => {
          console.log(`(${arg}) failed`);
          process.exit(1);
        });
    }
    if (arg === "--bootstrap-tags") {
      console.log("Bootstrapping tags...");
      bootstrap("tags")
        .then(() => {
          console.log(`(${arg}) success`);
          process.exit(0);
        })
        .catch(() => {
          console.log(`(${arg}) failed`);
          process.exit(1);
        });
    }
    if (arg === "--bootstrap-items") {
      console.log("Bootstrapping items...");
      bootstrap("items")
        .then(() => {
          console.log(`(${arg}) success`);
          process.exit(0);
        })
        .catch(() => {
          console.log(`(${arg}) failed`);
          process.exit(1);
        });
    }
    if (arg === "--bootstrap-sessions") {
      console.log("Bootstrapping sessions...");
      bootstrap("sessions")
        .then(() => {
          console.log(`(${arg}) success`);
          process.exit(0);
        })
        .catch(() => {
          console.log(`(${arg}) failed`);
          process.exit(1);
        });
    }
    if (arg === "--bootstrap-bosses") {
      console.log("Bootstrapping bosses...");
      bootstrap("bosses")
        .then(() => {
          console.log(`(${arg}) success`);
          process.exit(0);
        })
        .catch(() => {
          console.log(`(${arg}) failed`);
          process.exit(1);
        });
    }
    if (arg === "--build-config") {
      // Build the config here.
      const config = BuildConfig.build()
        .then((config: any) => {
          console.log("Config Successfully built.");
          console.log(config);
          const fileLoc = path.join(process.cwd(), "..", "raids.config.json");
          console.log("Writing config file to: ", fileLoc);
          fs.writeFileSync(fileLoc, JSON.stringify(config, null, 2));
          process.exit(0);
        })
        .catch((err) => {
          console.log("Failed to build config.");
          console.log(err);
          process.exit(1);
        });
    }

    if (arg === "--process-postgame-file") {
      //Process postgame file here...
      PostGameProcessor.process("raids.postgame");
    }

    if (arg === "--start-sync") {
      console.log("Starting sync app...");
      // setInterval(proxyClientLoop, 1000 * 10);
      process.exit(0);
    }
  });
})();
