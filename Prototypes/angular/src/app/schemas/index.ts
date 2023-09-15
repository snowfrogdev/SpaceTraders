import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";

export type RxCollections = {
  user: RxUserCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;