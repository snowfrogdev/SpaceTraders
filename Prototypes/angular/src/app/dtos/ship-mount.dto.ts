import { ShipMountDepositSymbol } from "./ship-mount-deposit-symbol";
import { ShipRequirements } from "./ship-requirements";

export type ShipMountDto = {
  symbol: ShipMountSymbol;
  name: string;
  description: string;
  strength: number;
  deposits: ShipMountDepositSymbol[];
  requirements: ShipRequirements;
};
