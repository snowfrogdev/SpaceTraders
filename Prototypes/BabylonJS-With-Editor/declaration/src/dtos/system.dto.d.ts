import { SystemFactionDto } from "./system-faction.dto";
import { SystemType } from "./system-type";
import { SystemWaypointDto } from "./system-waypoint.dto";
export declare type SystemDto = {
    symbol: string;
    sectorSymbol: string;
    type: SystemType;
    x: number;
    y: number;
    waypoints: SystemWaypointDto[];
    factions: SystemFactionDto[];
};
