import { ShipEngineSymbol } from "./ship-engine-symbol";
import { ShipRequirements } from "./ship-requirements";

export type ShipEngine = {
  symbol: ShipEngineSymbol;
  name: string;
  description: string;
  condition: number;
  speed: number;
  requirements: ShipRequirements;
};
