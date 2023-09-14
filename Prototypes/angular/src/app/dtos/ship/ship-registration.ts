import { FactionSymbol } from "../faction/faction-symbol";
import { ShipRole } from "./ship-role";

export type ShipRegistration = {
  name: string;
  factionSymbol: FactionSymbol;
  role: ShipRole;
};
