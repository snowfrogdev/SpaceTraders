import { FactionSymbol } from "../factions/faction-symbol";
import { Chart } from "./chart";
import { WaypointTrait } from "./waypoint-trait";
import { WaypointType } from "./waypoint-type";

export type WaypointDto = {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
  orbitals: { symbol: string }[];
  orbits: string | undefined;
  faction: { symbol: FactionSymbol };
  traits: WaypointTrait[];
  chart: Chart;
};
