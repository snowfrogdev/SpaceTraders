import { AgentDto } from "./agent.dto";
import { ContractDto } from "./contracts/contract.dto";
import { FactionDto } from "./factions/faction.dto";
import { ShipDto } from "./fleet/ship.dto";

export type RegisterNewAgentDto = {
  agent: AgentDto;
  contract: ContractDto;
  faction: FactionDto;
  ship: ShipDto;
  token: string;
};
