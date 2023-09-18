import { WaypointType } from "../systems/waypoint-type";

export type ShipNavRouteWaypoint = {
  symbol: string;
  type: WaypointType;
  systemSymbol: string;
  x: number;
  y: number;
};
