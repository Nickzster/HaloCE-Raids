import { v4 as uuidv4 } from "uuid";

const buildSamplePlayer = (name: string, activeClassId: string) => ({
  active_class_id: activeClassId,
  equipment_id: null,
  loadout: {
    primary_weapon_id: "assault_rifle",
    secondary_weapon_id: "magnum",
  },
  version: "qwertyuiop",
  collection: [
    "magnum",
    "assault_rifle",
    "chaingun",
    "plasma_rifle",
    "plasma_pistol",
    "shotgun",
    "smg",
  ],
  name,
  password: "qwertyuiop123456",
  hash: "",
  player_code: 123456,
  avatar: "master-chief",
});

const samplePlayers = [
  buildSamplePlayer("Nickster", "dps"),
  buildSamplePlayer("Ender", "medic"),
  buildSamplePlayer("Bungie", "tank"),
];

export const getAll = () => {
  return samplePlayers;
};

export const get = (id: string, withPassword: boolean) => {
  return samplePlayers.find((item) => item.name === id);
};

export const query = (query: any) => {
  return samplePlayers.reduce((previous: any[], currentItem: any) => {
    let matches = 0;
    for (let key in query) {
      if (currentItem[key] === query[key]) matches++;
    }

    if (matches > 0) previous.push(currentItem);
    return previous;
  }, new Array<any>());
};

export const create = (recordToCreate: any, id = uuidv4()) => {
  samplePlayers.push(recordToCreate);
};

export const update = (id: string, updatedRecord: any) => {
  const index = samplePlayers.reduce((previous, currentItem, currentIndex) => {
    if (previous !== -1) return previous;
    if (currentItem.name === id) return currentIndex;
    return -1;
  }, -1);

  let recordToUpdate: any = samplePlayers[index];

  for (let key in updatedRecord) {
    recordToUpdate[key] = updatedRecord[key];
  }

  samplePlayers[index] = recordToUpdate;
};
