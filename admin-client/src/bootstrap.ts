import FirebaseController from "./firebase";

export type Tables = "players" | "tags" | "sessions" | "bosses" | "items";

const BOOTSTRAP_DATA = {
  players: [
    {
      name: "Nickster",
      hash: "9bdc0d94292ee845372187165a0fff2e",
      active_class_id: "dps",
      equipment_id: null,
      loadout: {
        primary_weapon_id: "assault_rifle",
        secondary_weapon_id: "magnum",
      },
      version: "abcdef",
      collection: [
        "magnum",
        "assault_rifle",
        "chaingun",
        "plasma_rifle",
        "plasma_pistol",
        "shotgun",
        "smg",
      ],
      player_code: "458715",
      id: "Nickster",
    },
  ],
  sessions: [],
  bosses: [],
  tags: [
    {
      key: "magnum",
      id: "magnum",
      ref: "aerial\\weapons\\magnum\\magnum",
    },
    {
      key: "assault_rifle",
      id: "assault_rifle",
      ref: "aerial\\weapons\\heavy assault rifle\\heavy assault rifle",
    },
    {
      key: "fuel_rod_gun",
      id: "fuel_rod_gun",
      ref: "aerial\\weapons\\big fuelrod gun\\big fuelrod gun",
    },
    {
      key: "chaingun",
      id: "chaingun",
      ref: "aerial\\weapons\\chaingun\\chaingun",
    },
    {
      key: "energy_sword",
      id: "energy_sword",
      ref: "aerial\\weapons\\energy sword\\energy sword",
    },
    {
      key: "gravity_rifle",
      id: "gravity_rifle",
      ref: "aerial\\weapons\\gravity rifle\\gravity rifle",
    },
    {
      key: "machete",
      id: "machete",
      ref: "aerial\\weapons\\machete\\machete",
    },
    {
      key: "needler",
      id: "needler",
      ref: "aerial\\weapons\\needler\\needler",
    },
    {
      key: "plasma_pistol",
      id: "plasma_pistol",
      ref: "aerial\\weapons\\plasma pistol\\plasma pistol",
    },
    {
      key: "plasma_rifle",
      id: "plasma_rifle",
      ref: "aerial\\weapons\\plasma rifle\\plasma rifle",
    },
    {
      key: "rocket_launcher",
      id: "rocket_launcher",
      ref: "aerial\\weapons\\rocketlauncher\\rocketlauncher",
    },
    {
      key: "shotgun",
      id: "shotgun",
      ref: "aerial\\weapons\\shotgun\\shotgun",
    },
    {
      key: "smg",
      id: "smg",
      ref: "aerial\\weapons\\smg\\smg",
    },
    {
      key: "super_shotgun",
      id: "super_shotgun",
      ref: "aerial\\weapons\\super shotgun\\super shotgun",
    },
  ],
  items: [],
};

export const bootstrap = async (key: Tables) => {
  try {
    const data = BOOTSTRAP_DATA[key];
    for (let i = 0; i < data.length; i++) {
      let recordToCreate = data[i];
      if (recordToCreate.id) {
        let id = recordToCreate.id;
        recordToCreate.id = undefined;
        await new FirebaseController(key).create(recordToCreate, id);
        continue;
      }
      await new FirebaseController(key).create(recordToCreate);
    }
  } catch (err) {
    throw err;
  }
};
