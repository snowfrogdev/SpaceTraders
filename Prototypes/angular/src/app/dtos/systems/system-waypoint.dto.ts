import { WaypointType } from "./waypoint-type";

export type SystemWaypointDto = {
  symbol: string;
  type: WaypointType;
  x: number;
  y: number;
};
