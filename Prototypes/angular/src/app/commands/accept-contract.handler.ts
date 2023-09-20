import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { ContractDto } from "../dtos/contracts/contract.dto";
import { Dto } from "../dtos/dto";
import { AgentDto } from "../dtos/agent.dto";

export class AcceptContractCommand extends Command {
  constructor(public readonly contractId: string, public readonly agentToken: string) {
    super();
  }
}

export class AcceptContractHandler implements CommandHandler<AcceptContractCommand> {
  handles = AcceptContractCommand;

  constructor(private readonly _http: HttpClient, private readonly _db: DatabaseService) {}
  async handle(command: AcceptContractCommand): Promise<void> {
    const headers = {
      Authorization: `Bearer ${command.agentToken}`,
    };

    this._http
      .post<Dto<{ agent: AgentDto; contract: ContractDto }>>(
        `${environment.apiUrl}/my/contracts/${command.contractId}/accept`,
        undefined,
        { headers }
      )
      .subscribe(async (dto) => {
        const data = {
          agentSymbol: dto.data.agent.symbol,
          id: dto.data.contract.id,
          factionSymbol: dto.data.contract.factionSymbol,
          type: dto.data.contract.type,
          terms: dto.data.contract.terms,
          accepted: dto.data.contract.accepted,
          fulfilled: dto.data.contract.fulfilled,
          deadlineToAccept: dto.data.contract.deadlineToAccept,
        };
        await this._db.db.contract.upsert(data);
      });
  }
}
