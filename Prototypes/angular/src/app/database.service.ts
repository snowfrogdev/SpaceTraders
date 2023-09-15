import { Injectable, InjectionToken } from "@angular/core";
import { createRxDatabase } from "rxdb";
import { USER_SCHEMA } from "./schemas/user.schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { RxSpaceTradersDatabase, RxCollections } from "./schemas";

const collectionSettings = {
  user: {
    schema: USER_SCHEMA,
  },
};

/**
 * creates the database
 */
async function _create(): Promise<RxSpaceTradersDatabase> {
  const db = await createRxDatabase<RxCollections>({
    name: "space-traders",
    storage: getRxStorageDexie(),
    multiInstance: false,
    eventReduce: true,
  });

  await db.addCollections(collectionSettings);

  return db;
}

let initState: null | Promise<any> = null;
let DB_INSTANCE: RxSpaceTradersDatabase;

/**
 * This is run via APP_INITIALIZER main.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {
  if (!initState) {
    initState = _create().then((db) => (DB_INSTANCE = db));
  }
  await initState;
}

@Injectable()
export class DatabaseService {
  get db(): RxSpaceTradersDatabase {
    return DB_INSTANCE;
  }
}
