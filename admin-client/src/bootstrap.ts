import FirebaseController from "./firebase";

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
    },
  ],
  sessions: [],
  bosses: [],
  tags: [
    {
      key: "magnum",
      ref: "aerial\\weapons\\magnum\\magnum",
    },
    {
      key: "assault_rifle",
      ref: "aerial\\weapons\\heavy assault rifle\\heavy assault rifle",
    },
    {
      key: "fuel_rod_gun",
      ref: "aerial\\weapons\\big fuelrod gun\\big fuelrod gun",
    },
    {
      key: "chaingun",
      ref: "aerial\\weapons\\chaingun\\chaingun",
    },
    {
      key: "energy_sword",
      ref: "aerial\\weapons\\energy sword\\energy sword",
    },
    {
      key: "gravity_rifle",
      ref: "aerial\\weapons\\gravity rifle\\gravity rifle",
    },
    {
      key: "machete",
      ref: "aerial\\weapons\\machete\\machete",
    },
    {
      key: "needler",
      ref: "aerial\\weapons\\needler\\needler",
    },
    {
      key: "plasma_pistol",
      ref: "aerial\\weapons\\plasma pistol\\plasma pistol",
    },
    {
      key: "plasma_rifle",
      ref: "aerial\\weapons\\plasma rifle\\plasma rifle",
    },
    {
      key: "rocket_launcher",
      ref: "aerial\\weapons\\rocketlauncher\\rocketlauncher",
    },
    {
      key: "shotgun",
      ref: "aerial\\weapons\\shotgun\\shotgun",
    },
    {
      key: "smg",
      ref: "aerial\\weapons\\smg\\smg",
    },
    {
      key: "super_shotgun",
      ref: "aerial\\weapons\\super shotgun\\super shotgun",
    },
  ],
  items: [],
};

export const bootstrap = async (
  key: "players" | "tags" | "sessions" | "bosses" | "items"
) => {
  try {
    const data = BOOTSTRAP_DATA[key];
    for (let i = 0; i < data.length; i++) {
      await new FirebaseController(key).create(data[i]);
    }
  } catch (err) {
    throw err;
  }
};
