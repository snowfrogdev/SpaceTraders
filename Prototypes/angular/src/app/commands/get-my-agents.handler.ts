import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { AgentDto } from "../dtos/agent.dto";
import { DatabaseService } from "../services/database.service";
import { Dto } from "../dtos/dto";

export class GetPublicAgentCommand extends Command {
  constructor(public readonly symbol: string) {
    super();
  }
}

export class GetPublicAgentHandler implements CommandHandler<GetPublicAgentCommand> {
  handles = GetPublicAgentCommand;

  constructor(private readonly _http: HttpClient, private readonly _db: DatabaseService) {}
  async handle(command: GetPublicAgentCommand): Promise<void> {
    this._http.get<Dto<AgentDto>>(`${environment.apiUrl}/agents/${command.symbol}`).subscribe(async (dto) => {
      await this._db.db.agent.upsert(dto.data);
    });
  }
}
