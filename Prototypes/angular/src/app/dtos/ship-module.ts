import { ShipModuleSymbol } from "./ship-module-symbol";
import { ShipRequirements } from "./ship-requirements";

export type ShipModule = {
  symbol: ShipModuleSymbol;
  capacity: number;
  range: number;
  name: string;
  description: string;
  requirements: ShipRequirements;
};
