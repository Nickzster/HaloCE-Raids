import { v4 as uuidv4 } from "uuid";

const buildSamplePlayer = (
  name: string,
  activeClassId: string,
  level = "player"
) => ({
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
  owner: name,
  password: "$2a$10$/hgkRVYD4BW6VxAuWuAnJeoRiJkGMAkBC.mRbuPXyEnQyltvt5agK",
  hash: "",
  player_code: 123456,
  avatar: "master-chief",
  level,
});

const samplePlayers = [
  buildSamplePlayer("Nickster", "dps", "admin"),
  buildSamplePlayer("Ender", "medic"),
  buildSamplePlayer("Bungie", "tank"),
];

export const getAll = () => {
  return samplePlayers;
};

export const get = (id: string, withPassword: boolean) => {
  return samplePlayers.find((item) => item.owner === id);
};

export const query = (query: any) => {
  return samplePlayers.reduce((previous: any[], currentItem: any) => {
    let matches = 0;
    for (let key in query) {
      if (!!query[key] && currentItem[key] === query[key]) matches++;
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
    if (currentItem.owner === id) return currentIndex;
    return -1;
  }, -1);

  if (index === -1) return null;

  let recordToUpdate: any = samplePlayers[index];

  let changes = 0;
  for (let key in updatedRecord) {
    if (!!updatedRecord[key]) {
      changes++;
      recordToUpdate[key] = updatedRecord[key];
    }
  }

  if (changes === 0) return null;

  samplePlayers[index] = recordToUpdate;

  return recordToUpdate;
};
