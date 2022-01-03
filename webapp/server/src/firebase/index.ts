import FirebaseDriver from "./driver";
import { v4 as uuidv4 } from "uuid";

export type Tables = "players" | "tags" | "sessions" | "bosses" | "items";

const isValidString = (str: string) => !!str && str !== "";

export interface IBaseQuery {
  page?: number;
}

export interface IPlayerQuery extends IBaseQuery {
  active_player_class: string;
  name: string;
}

export interface IItemQuery extends IBaseQuery {}

export interface IEventQuery extends IBaseQuery {}

export interface IBossQuery extends IBaseQuery {}

export interface ITagQuery extends IBaseQuery {}

class FirebaseController {
  private db: FirebaseFirestore.Firestore;
  private collectionName: Tables;
  public constructor(collectionName: Tables) {
    this.collectionName = collectionName;
    this.db = FirebaseDriver.initalize().getDB();
    return this;
  }

  public async getAll() {
    // Get All
    const returnedItems: any[] = [];
    const items = await this.db.collection(this.collectionName).get();
    items.forEach((item) => {
      let data = item.data();
      if (!!data && data["password"]) data["password"] = undefined;
      returnedItems.push({ item: item.data(), id: item.id });
    });
    return returnedItems;
  }

  public async get(id: string, withPassword: boolean = false) {
    const fbRef = this.db.collection(this.collectionName);
    const data = await (await fbRef.doc(id).get()).data();
    if (!withPassword && !!data && data["password"])
      data["password"] = undefined;
    return data;
  }

  public async query(query: any) {
    try {
      let fbRef = this.db.collection(this.collectionName);
      let fbQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> =
        fbRef;

      const MAX_REQUEST_ITEMS = query.page || 10;

      fbQuery = fbQuery.limit(MAX_REQUEST_ITEMS);

      for (let queryItemKey in query) {
        if (isValidString(query[queryItemKey]))
          fbQuery = fbQuery.where(queryItemKey, "==", query[queryItemKey]);
      }

      const results = await fbQuery.get();
      const queried: any[] = [];

      results.forEach((result) => {
        let data = result.data();
        data["password"] = undefined;
        queried.push(data);
      });

      return queried;
    } catch (err) {
      throw err;
    }
  }

  public async create(recordToCreate: any, id = uuidv4()) {
    try {
      const fbRef = this.db.collection(this.collectionName);
      const res = await fbRef.doc(id).set(recordToCreate);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async update(id: string, updatedRecord: any) {
    try {
      const recordToUpdate = await this.get(id, true);

      if (!recordToUpdate) return null;

      // Need to scan through input to ONLY update deltas
      let changes = 0;
      for (let key in recordToUpdate) {
        if (!!updatedRecord[key]) {
          changes++;
          recordToUpdate[key] = updatedRecord[key];
          continue;
        }
      }

      if (changes === 0) return null;

      const response = await this.db
        .collection(this.collectionName)
        .doc(id)
        .set(recordToUpdate);
      return response;
    } catch (err) {
      throw err;
    }
  }

  public async delete(id: string) {
    try {
      await this.db.collection(this.collectionName).doc(id).delete();
    } catch (err) {
      throw err;
    }
  }
}

export default FirebaseController;
