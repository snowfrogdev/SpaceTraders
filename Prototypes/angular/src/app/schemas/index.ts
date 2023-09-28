import { RxDatabase } from "rxdb";
import { RxUserCollection } from "./user.schema";
import { RxAgentCollection } from "./agent.schema";
import { RxWaypointCollection } from "./waypoint.schema";
import { RxContractCollection } from "./contracts.schema";
import { RxSystemCollection } from "./system.schema";
import { RxShipCollection } from "./ship.schema";

export type RxCollections = {
  agent: RxAgentCollection;
  contract: RxContractCollection;
  ship: RxShipCollection;
  system: RxSystemCollection;
  user: RxUserCollection;
  waypoint: RxWaypointCollection;
};

export type RxSpaceTradersDatabase = RxDatabase<RxCollections>;
