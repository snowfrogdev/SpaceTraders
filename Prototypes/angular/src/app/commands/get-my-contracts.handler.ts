import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { ContractDto } from "../dtos/contracts/contract.dto";
import { ListDto } from "../dtos/list.dto";

export class GetMyContractsCommand extends Command {
  constructor(public readonly agentSymbol: string, public readonly agentToken: string) {
    super();
  }
}

export class GetMyContractsHandler implements CommandHandler<GetMyContractsCommand> {
  handles = GetMyContractsCommand;

  constructor(private readonly _http: HttpClient, private readonly _db: DatabaseService) {}
  async handle(command: GetMyContractsCommand): Promise<void> {
    const headers = {
      Authorization: `Bearer ${command.agentToken}`,
    };

    // TODO: Figure out how to make sure to get all of the contracts if there are more than 20
    this._http
      .get<ListDto<ContractDto>>(`${environment.apiUrl}/my/contracts?page=1&limit=20`, { headers })
      .subscribe(async (dto) => {
        const data = dto.data.map((contract) => {
          return {
            agentSymbol: command.agentSymbol,
            id: contract.id,
            factionSymbol: contract.factionSymbol,
            type: contract.type,
            terms: contract.terms,
            accepted: contract.accepted,
            fulfilled: contract.fulfilled,
            deadlineToAccept: contract.deadlineToAccept,
          };
        });

        await this._db.db.contract.bulkUpsert(data);
      });
  }
}
