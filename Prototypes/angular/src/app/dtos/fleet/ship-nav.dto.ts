import { ShipNavFlightMode } from "./ship-nav-flight-mode";
import { ShipNavRoute } from "./ship-nav-route";
import { ShipNavStatus } from "./ship-nav-status";

export type ShipNavDto = {
  systemSymbol: string;
  waypointSymbol: string;
  route: ShipNavRoute;
  status: ShipNavStatus;
  flightMode: ShipNavFlightMode;
};
