import FirebaseController from "../firebase";

interface IConfig {
  players: any[];
  bosses: any[];
  tags: any[];
  items: any[];
  sessions: any[];
}

class BuildConfig {
  private config: IConfig;

  private constructor() {
    this.config = {
      players: [],
      bosses: [],
      tags: [],
      items: [],
      sessions: [],
    };
  }

  private async buildTags() {
    try {
      /* logic here */
      const data = await new FirebaseController("tags").get();
      data.forEach((tag) =>
        this.config.tags.push({ firebase_id: tag.id, tag: tag.item })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async buildBosses() {
    try {
      /* logic here */
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async buildItems() {
    try {
      /* logic here */
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async buildPlayers() {
    try {
      /* logic here */
      const data = await new FirebaseController("players").get();
      data.forEach((player) =>
        this.config.players.push({
          firebase_id: player.id,
          player: player.item,
        })
      );
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async buildSessions() {
    try {
      /* logic here */
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  private async getConfig() {
    return this.config;
  }

  public static async build() {
    try {
      const buildConfigObject = new BuildConfig();
      await buildConfigObject.buildBosses();
      await buildConfigObject.buildItems();
      await buildConfigObject.buildPlayers();
      await buildConfigObject.buildSessions();
      await buildConfigObject.buildTags();
      return buildConfigObject.getConfig();
    } catch (err) {
      throw err;
    }
  }
}

export default BuildConfig;
