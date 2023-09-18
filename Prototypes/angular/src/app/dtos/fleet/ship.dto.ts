import { ShipCargoDto } from "./ship-cargo.dto";
import { ShipCrew } from "./ship-crew";
import { ShipEngine } from "./ship-engine";
import { ShipFrame } from "./ship-frame";
import { ShipFuel } from "./ship-fuel";
import { ShipModule } from "./ship-module";
import { ShipMountDto } from "./ship-mount.dto";
import { ShipNavDto } from "./ship-nav.dto";
import { ShipReactor } from "./ship-reactor";
import { ShipRegistration } from "./ship-registration";

export type ShipDto = {
  symbol: string;
  registration: ShipRegistration;
  nav: ShipNavDto;
  crew: ShipCrew;
  frame: ShipFrame;
  reactor: ShipReactor;
  engine: ShipEngine;
  modules: ShipModule[];
  mounts: ShipMountDto[];
  cargo: ShipCargoDto;
  fuel: ShipFuel;
};
