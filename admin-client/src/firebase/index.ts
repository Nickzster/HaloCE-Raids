import FirebaseDriver from "./driver";
import { v4 as uuidv4 } from "uuid";
import { Tables } from "../bootstrap";

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
    items.forEach((item) =>
      returnedItems.push({ item: item.data(), id: item.id })
    );
    return returnedItems;
  }

  public async get(query = { id: null, ids: null }) {
    const fbRef = this.db.collection(this.collectionName);
    if (query.id) {
      // Get by ID
      const item = await (await fbRef.doc(query.id).get()).data();
      return item;
    }
    if (query.ids) {
      //Get by multiple ID's
    }

    return null;
  }

  public async create(recordToCreate: any, id = uuidv4()) {
    try {
      const ref = this.db.collection(this.collectionName);
      const res = await ref.doc(id).set(recordToCreate);
      return res;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public async update(id, updatedRecord) {
    try {
      if (this.collectionName === "players") {
        const recordToUpdate = await this.get({ id, ids: null });

        // Need to scan through input to ONLY update deltas
        let changes = 0;
        for (let key in recordToUpdate) {
          if (updatedRecord[key]) {
            changes++;
            recordToUpdate[key] = updatedRecord[key];
          }
        }

        if (changes === 0) return null;

        const response = await this.db
          .collection(this.collectionName)
          .doc(id)
          .set(recordToUpdate);
        return response;
      }

      return null;
    } catch (err) {
      throw err;
    }
  }

  public async delete() {}
}

export default FirebaseController;
