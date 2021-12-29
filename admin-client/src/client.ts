import FirebaseController from "./firebase";
import BuildConfig from "./lib/BuildConfig";

const SESSION_SERVER_PLAYER_MAP: Map<string, any> = new Map<string, any>();

const SESSION_SAPP_PLAYER_MAP: Map<string, any> = new Map<string, any>();

const writeToSapp = () => {};

const writeToServer = () => {};

const checkSappChanges = async () => {
  console.log("Polling SAPP file for updates...");
};

const checkServerChanges = async () => {
  console.log("Polling server for updates...");
};

export const proxyClientLoop = () => {
  if (SESSION_SERVER_PLAYER_MAP.size === 0) {
    console.log("Building players table...");
    new FirebaseController("players")
      .get()
      .then((players: { id: string; item: any }[]) => {
        players.forEach((player) =>
          SESSION_SERVER_PLAYER_MAP.set(player.id, player.item)
        );
      })
      .catch((err) => console.error("Failed to fetch players!", err));
  }
  if (SESSION_SERVER_PLAYER_MAP.size === 0) {
  }
  checkSappChanges();
  checkServerChanges();
};
