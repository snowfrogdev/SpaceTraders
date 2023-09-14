import { InjectionToken } from "@angular/core";
import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxCollection,
  RxDatabase,
  RxJsonSchema,
  createRxDatabase,
  toTypedRxJsonSchema,
} from "rxdb";
import { getRxStorageDexie } from "rxdb/plugins/storage-dexie";

export const DB = new InjectionToken<MyDatabse>("DB");

export async function createDB(): Promise<MyDatabse> {
  const dataBase: RxDatabase<RxCollections> = await createRxDatabase({
    name: "space-traders",
    storage: getRxStorageDexie(),
    multiInstance: false,
    eventReduce: true,
  });

  await dataBase.addCollections({
    users: {
      schema: USER_SCHEMA,
    },
  });

  return dataBase;
}

export type RxCollections = {
  users: RxCollection<RxUserDocumentType>;
};

export type MyDatabse = RxDatabase<RxCollections>;

const USER_SCHEMA_LITERAL = {
  version: 0,
  primaryKey: "symbol",
  type: "object",
  properties: {
    symbol: {
      type: "string",
      maxLength: 100,
    },
    faction: {
      type: "string",
    },
    email: {
      type: "string",
    },
    password: {
      type: "string",
    },
    token: {
      type: "string",
    },
  },
  required: ["symbol", "faction", "email", "password", "token"],
} as const;

const userSchemaTyped = toTypedRxJsonSchema(USER_SCHEMA_LITERAL);
type RxUserDocumentType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof userSchemaTyped>;

export const USER_SCHEMA: RxJsonSchema<RxUserDocumentType> = USER_SCHEMA_LITERAL;
