import { AgentDto } from "./agent.dto";
import { ContractDto } from "./contract/contract.dto";
import { FactionDto } from "./faction/faction.dto";
import { ShipDto } from "./ship/ship.dto";

export type RegisterNewAgentDto = {
  agent: AgentDto;
  contract: ContractDto;
  faction: FactionDto;
  ship: ShipDto;
  token: string;
};
