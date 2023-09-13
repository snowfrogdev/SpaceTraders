import { ShipNavRouteWaypoint } from "./ship-nav-route-waypoint";

export type ShipNavRoute = {
  destination: ShipNavRouteWaypoint;
  departure: ShipNavRouteWaypoint;
  departureTime: string;
  arrival: string;
};
