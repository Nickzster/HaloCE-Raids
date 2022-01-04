export type ItemType =
  | "ARMOR"
  | "WEAPON"
  | "EQUIPMENT"
  | "BOSS"
  | "KEY"
  | "ULTIMATE";

type Classes = "ammo" | "dps" | "medic" | "tank" | "boss";

export interface IPlayer {
  name: string;
  active_class_id: string;
  equipment_id: string;
  loadout: {
    primary_weapon_id: string;
    secondary_weapon_id: string;
  };
  version: string;
  collection: string[];
  player_code: string;
  password: string;
  avatar: string;
  level: "banned" | "player" | "admin";
}

export interface ITag {
  key: string;
  ref: string;
}

interface IWeaponProperties {
  max_ammo: number;
  damage: number;
}

interface IArmorProperties {
  max_health: number;
}

export interface IItem {
  tag_key: string;
  type: ItemType;
  pretty: string;
  weapon_properties: IWeaponProperties;
  armor_properties: IArmorProperties;
  skin: string;
  shield_power: {
    percentage: number;
    int: number;
  };
  armor_penetration: {
    percentage: number;
    int: number;
  };
  accuracy: number;
  compatibility: { [key in Classes]: boolean };
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
