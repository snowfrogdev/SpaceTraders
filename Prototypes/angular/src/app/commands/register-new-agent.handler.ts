import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { RegisterNewAgentDto } from "../dtos/register-new-agent.dto";
import { AuthService } from "../services/auth.service";
import { Dto } from "../dtos/dto";
import { DatabaseService } from "../services/database.service";

export class RegisterNewAgentCommand extends Command {
  constructor(public readonly symbol: string, public readonly faction: string, public readonly email: string) {
    super();
  }
}

export class RegisterNewAgentHandler implements CommandHandler<RegisterNewAgentCommand> {
  handles = RegisterNewAgentCommand;

  constructor(
    private readonly _http: HttpClient,
    private readonly _authService: AuthService,
    private readonly _db: DatabaseService
  ) {}
  async handle(command: RegisterNewAgentCommand): Promise<void> {
    const body = {
      faction: command.faction,
      symbol: command.symbol,
      email: command.email,
    };
    this._http.post<Dto<RegisterNewAgentDto>>(`${environment.apiUrl}/register`, body).subscribe(async (dto) => {
      const user = await this._authService.getUser();
      if (!user) {
        throw new Error("User not found");
      }
      const agentForUser = { symbol: dto.data.agent.symbol, token: dto.data.token };
      const userDoc = await this._db.db.user.findOne(user.id).exec();
      if (!userDoc) {
        throw new Error("User not found in database");
      }
      await userDoc.patch({ agents: [...user.agents, agentForUser] });
    });
  }
}
