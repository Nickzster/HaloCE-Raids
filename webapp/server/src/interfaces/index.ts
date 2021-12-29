export interface IPlayer {
  active_class_id: string;
  equipment_id: string;
  loadout: {
    primary_weapon_id: string;
    secondary_weapon_id: string;
  };
  version: string;
  collection: string[];
  player_code: string;
}

export interface ITag {
  key: string;
  ref: string;
}

export interface IItem {
  key: string;
  human: string;
}

export interface IBoss {}

export interface ISession {}

// const typeInObject = (object: any): boolean => "type" in object;
// export const isPlayer = (object: any): object is IPlayer =>
//   typeInObject(object) && object.type === "PLAYER";
// export const isTag = (object: any): object is ITag =>
//   typeInObject(object) && object.type === "TAG";
// export const isItem = (object: any): object is IItem =>
//   typeInObject(object) && object.type === "ITEM";
// export const isBoss = (object: any): object is IBoss =>
//   typeInObject(object) && object.type === "BOSS";
// export const isSession = (object: any): object is ISession =>
//   typeInObject(object) && object.type === "SESSION";
