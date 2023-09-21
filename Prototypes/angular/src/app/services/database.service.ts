import { Injectable, isDevMode } from "@angular/core";
import { addRxPlugin, createRxDatabase } from "rxdb";
import { USER_SCHEMA } from "../schemas/user.schema";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";
import { wrappedValidateAjvStorage } from "rxdb/plugins/validate-ajv";
import { RxSpaceTradersDatabase, RxCollections } from "../schemas";
import { AGENT_SCHEMA } from "../schemas/agent.schema";
import { RxDBQueryBuilderPlugin } from "rxdb/plugins/query-builder";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { WAYPOINT_SCHEMA } from "../schemas/waypoint.schema";
import { CONTRACT_SCHEMA } from "../schemas/contracts.schema";
import { SYSTEM_SCHEMA } from "../schemas/system.schema";

if (isDevMode()) {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);

const collectionSettings = {
  user: {
    schema: USER_SCHEMA,
  },
  agent: {
    schema: AGENT_SCHEMA,
  },
  waypoint: {
    schema: WAYPOINT_SCHEMA,
  },
  contract: {
    schema: CONTRACT_SCHEMA,
  },
  system: {
    schema: SYSTEM_SCHEMA
  }
};

/**
 * creates the database
 */
async function _create(): Promise<RxSpaceTradersDatabase> {
  const db = await createRxDatabase<RxCollections>({
    name: "space-traders",
    storage: wrappedValidateAjvStorage({ storage: getRxStorageDexie() }),
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
