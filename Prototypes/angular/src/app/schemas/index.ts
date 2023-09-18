import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";
import { RxAgentCollection } from "./agent.schema";
import { RxWaypointtCollection } from "./waypoint.schema";

export type RxCollections = {
  user: RxUserCollection;
  agent: RxAgentCollection;
  waypoint: RxWaypointtCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;