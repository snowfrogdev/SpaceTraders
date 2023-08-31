export class Repository<T> {
  private db: IDBDatabase | undefined;
  constructor(private objectStoreName: string) {}

  async *list(filterFn = () => true) {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    yield* this.cursorGenerator(store, filterFn);
  }

  async get(key): Promise<T> {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    return new Promise((resolve, reject) => {
      const request: IDBRequest<T> = store.get(key);
      request.onsuccess = (e) => resolve((e.target as IDBRequest<T>).result);
      request.onerror = (e) => reject((e.target as IDBRequest<T>).error);
    });
  }

  async count(): Promise<number> {
    await this.ensureDatabaseInitialized();

    const transaction = this.db.transaction([this.objectStoreName], "readonly");
    const store = transaction.objectStore(this.objectStoreName);

    return new Promise((resolve, reject) => {
      const request: IDBRequest<number> = store.count();
      request.onsuccess = (e) => resolve((e.target as IDBRequest<number>).result);
      request.onerror = (e) => reject((e.target as IDBRequest<number>).error);
    });
  }

  async save(entity: T) {
    await this.ensureDatabaseInitialized();
    const transaction = this.db.transaction([this.objectStoreName], "readwrite");
    const store = transaction.objectStore(this.objectStoreName);

    store.put(entity);
  }

  private async *cursorGenerator(store: IDBObjectStore, filterFn = (item: T) => true) {
    let cursor = await this.getFirstCursor(store);

    while (cursor) {
      if (filterFn(cursor.value)) {
        yield cursor.value as T;
      }
      cursor = await this.getNextCursor(cursor);
    }
  }

  private getFirstCursor(store: IDBObjectStore) {
    return new Promise<IDBCursorWithValue>((resolve, reject) => {
      const request = store.openCursor();
      request.onsuccess = (e) => resolve((e.target as IDBRequest<IDBCursorWithValue>).result);
      request.onerror = (e) => reject((e.target as IDBRequest<IDBCursorWithValue>).error);
    });
  }

  private getNextCursor(cursor: IDBCursorWithValue) {
    return new Promise<IDBCursorWithValue>((resolve, reject) => {
      cursor.continue();
      cursor.request.onsuccess = (e) => resolve((e.target as IDBRequest<IDBCursorWithValue>).result);
      cursor.request.onerror = (e) => reject((e.target as IDBRequest<IDBCursorWithValue>).error);
    });
  }

  private async ensureDatabaseInitialized() {
    if (!this.db) {
      await this.initDatabase();
    }
  }

  private initDatabase(): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request: IDBOpenDBRequest = indexedDB.open("spacetradersData", 1);

      request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
        const db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
        this.db = db;
        if (!this.db.objectStoreNames.contains("systems")) {
          this.db.createObjectStore("systems", { keyPath: "symbol" });
        }
      };

      request.onsuccess = (e: Event) => {
        const db: IDBDatabase = (e.target as IDBOpenDBRequest).result;
        this.db = db;
        resolve(this.db);
      };

      request.onerror = (e: Event) => {
        console.error("Error opening database:", e);
        reject(e);
      };
    });
  }
}
