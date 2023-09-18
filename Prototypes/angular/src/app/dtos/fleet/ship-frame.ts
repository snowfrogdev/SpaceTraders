import { ShipFrameSymbol } from "./ship-frame-type";
import { ShipRequirements } from "./ship-requirements";

export type ShipFrame = {
  symbol: ShipFrameSymbol;
  name: string;
  description: string;
  condition: number;
  moduleSlots: number;
  mountingPoints: number;
  fuelCapacity: number;
  requirements: ShipRequirements;
};
