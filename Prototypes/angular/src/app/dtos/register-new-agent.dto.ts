import { AgentDto } from "./agent.dto";
import { ContractDto } from "./contract.dto";
import { FactionDto } from "./faction.dto";
import { ShipDto } from "./ship.dto";

export type RegisterNewAgentDto = {
  agent: AgentDto;
  contract: ContractDto;
  faction: FactionDto;
  ship: ShipDto;
  token: string;
};
