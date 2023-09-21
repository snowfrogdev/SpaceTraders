import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";
import { RxAgentCollection } from "./agent.schema";
import { RxWaypointCollection } from "./waypoint.schema";
import { RxContractCollection } from "./contracts.schema";
import { RxSystemCollection } from "./system.schema";

export type RxCollections = {
  user: RxUserCollection;
  agent: RxAgentCollection;
  waypoint: RxWaypointCollection;
  contract: RxContractCollection;
  system: RxSystemCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;
