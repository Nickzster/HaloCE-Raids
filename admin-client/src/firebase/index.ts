import FirebaseDriver from "./driver";
import { v4 as uuidv4 } from "uuid";

class FirebaseController {
  private db: FirebaseFirestore.Firestore;
  private collectionName: string;
  public constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.db = FirebaseDriver.initalize().getDB();
    return this;
  }

  public async get(query = { id: null, ids: null }) {
    const returnedItems: any[] = [];
    if (query.id) {
      // Get by ID
    }
    if (query.ids) {
      //Get by multiple ID's
    }
    // Get All
    const items = await this.db.collection(this.collectionName).get();
    items.forEach((item) =>
      returnedItems.push({ item: item.data(), id: item.id })
    );
    return returnedItems;
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

  public async update() {}

  public async delete() {}
}

export default FirebaseController;
