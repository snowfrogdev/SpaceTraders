import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";
import { RxAgentCollection } from "./agent.schema";

export type RxCollections = {
  user: RxUserCollection;
  agent: RxAgentCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;