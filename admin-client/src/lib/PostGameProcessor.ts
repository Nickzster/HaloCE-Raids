import fs from "fs";
import path from "path";
import FirebaseController from "../firebase";

class PostGameProcessor {
  private fileName: string;
  private constructor(fileName: string) {
    this.fileName = fileName;
    return this;
  }

  private async updateHashCommand(args: any[]) {
    const firebaseID = args[0];
    const hash = args[1];
    console.log(`Updating record ${firebaseID} with value ${hash}`);
    const updatedRecord = await new FirebaseController("players").update(
      firebaseID,
      {
        hash,
      }
    );
  }

  private processFile() {
    const filePath = path.join(process.cwd(), "..", `${this.fileName}`);
    try {
      const fileContents = fs.readFileSync(filePath, { encoding: "utf-8" });
      const commandsFileContents = fileContents.trim();
      const commandsWithoutEndingQuote = commandsFileContents.slice(
        0,
        commandsFileContents.length - 1
      );
      const commandsWithoutBeginningQuote = commandsWithoutEndingQuote.slice(
        1,
        commandsWithoutEndingQuote.length
      );
      const commands = commandsWithoutBeginningQuote
        .split("|")
        .map((item) => item.trim().split(":"))
        .map((item) => ({ [item[0]]: item[1].trim().split(",") }));
      return commands;
    } catch (err) {
      console.log("ERROR:", err);
      console.log("Exiting now...");
      process.exit(1);
    }
  }

  public static async process(fileName: string) {
    const processor = new PostGameProcessor(fileName);
    const commands = processor.processFile();
    for (let i = 0; i < commands.length; i++) {
      let command = commands[i];
      if (command["update_hash"]) {
        await processor.updateHashCommand(command["update_hash"]);
        continue;
      }

      console.warn("WARNING: Found item with unsupported item:", command);
    }
  }
}

export default PostGameProcessor;
