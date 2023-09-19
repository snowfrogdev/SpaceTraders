import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";
import { RxAgentCollection } from "./agent.schema";
import { RxWaypointCollection } from "./waypoint.schema";
import { RxContractCollection } from "./contracts.schema";

export type RxCollections = {
  user: RxUserCollection;
  agent: RxAgentCollection;
  waypoint: RxWaypointCollection;
  contract: RxContractCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;
