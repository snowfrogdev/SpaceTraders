import { ShipReactorSymbol } from "./ship-reactor-symbol";
import { ShipRequirements } from "./ship-requirements";

export type ShipReactor = {
  symbol: ShipReactorSymbol;
  name: string;
  description: string;
  condition: number;
  powerOutput: number;
  requirements: ShipRequirements;
};
