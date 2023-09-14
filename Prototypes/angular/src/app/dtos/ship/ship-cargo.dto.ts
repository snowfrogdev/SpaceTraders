import { ShipCargoItem } from "./ship-cargo-item";

export type ShipCargoDto = {
  capacity: number;
  units: number;
  inventory: ShipCargoItem[];
};
