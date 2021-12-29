import admin from "firebase-admin";


class FirebaseDriver {
  private static instance: FirebaseDriver;
  private db: FirebaseFirestore.Firestore;

  private constructor() {
    admin.initializeApp({ credential: admin.credential.applicationDefault() });

    const db = admin.firestore();

    db.settings({ ignoreUndefinedProperties: true });
    this.db = db;
    return this;
  }

  public static initalize() {
    if (!FirebaseDriver.instance) {
      FirebaseDriver.instance = new FirebaseDriver();
    }
    return FirebaseDriver.instance;
  }

  public getDB() {
    return this.db;
  }

  public static generateId() {
    return 
  }
}

export default FirebaseDriver;