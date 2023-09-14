export type ShipCrew = {
  current: number;
  required: number;
  capacity: number;
  rotation: "STRICT" | "RELAXED";
  morale: 0;
  wages: 0;
};
