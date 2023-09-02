export class Repository {
  constructor(objectStoreName) {
    this.objectStoreName = objectStoreName;
    this.db = undefined;
  }

  async *list(filterFn = () => true) {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    yield* this.cursorGenerator(store, filterFn);
  }

  async get(key) {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async count() {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    return new Promise((resolve, reject) => {
      const request = store.count();
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  async save(entity) {
    await this.ensureDatabaseInitialized();
    const transaction = this.db.transaction([this.objectStoreName], "readwrite");
    const store = transaction.objectStore(this.objectStoreName);

    store.put(entity);
  }

  async *cursorGenerator(store, filterFn = (item) => true) {
    let cursor = await this.getFirstCursor(store);

    while (cursor) {
      if (filterFn(cursor.value)) {
        yield cursor.value;
      }
      cursor = await this.getNextCursor(cursor);
    }
  }

  getFirstCursor(store) {
    return new Promise((resolve, reject) => {
      const request = store.openCursor();
      request.onsuccess = (e) => resolve(e.target.result);
      request.onerror = (e) => reject(e.target.error);
    });
  }

  getNextCursor(cursor) {
    return new Promise((resolve, reject) => {
      cursor.continue();
      cursor.request.onsuccess = (e) => resolve(e.target.result);
      cursor.request.onerror = (e) => reject(e.target.error);
    });
  }

  async ensureDatabaseInitialized() {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  initDatabase() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("spacetradersData", 1);

      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        this.db = db;
        if (!this.db.objectStoreNames.contains("systems")) {
          this.db.createObjectStore("systems", { keyPath: "symbol" });
        }
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        this.db = db;
        resolve(this.db);
      };

      request.onerror = (e) => {
        console.error("Error opening database:", e);
        reject(e);
      };
    });
  }
}
