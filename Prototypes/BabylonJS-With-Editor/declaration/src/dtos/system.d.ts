import { SystemType } from "./system-type";
import { SystemWaypointDto } from "./system-waypoint.dto";
export declare type System = {
    symbol: string;
    sectorSymbol: string;
    type: SystemType;
    x: number;
    y: number;
    waypoints: SystemWaypointDto[];
    "factions": [
        {
            "symbol": "COSMIC";
        }
    ];
};
