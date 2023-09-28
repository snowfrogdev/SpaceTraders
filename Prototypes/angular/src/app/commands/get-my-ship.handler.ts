import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { ShipDto } from "../dtos/fleet/ship.dto";
import { Dto } from "../dtos/dto";

export class GetMyShipCommand extends Command {
  constructor(
    public readonly shipSymbol: string,
    public readonly agentSymbol: string,
    public readonly agentToken: string
  ) {
    super();
  }
}

export class GetMyShipHandler implements CommandHandler<GetMyShipCommand> {
  handles = GetMyShipCommand;

  constructor(private readonly _http: HttpClient, private readonly _db: DatabaseService) {}
  async handle(command: GetMyShipCommand): Promise<void> {
    const headers = {
      Authorization: `Bearer ${command.agentToken}`,
    };

    this._http
      .get<Dto<ShipDto>>(`${environment.apiUrl}/my/ships/${command.shipSymbol}`, { headers })
      .subscribe(async (dto) => {
        const data = {
          ...dto.data,
          agentSymbol: command.agentSymbol,
        };
        await this._db.db.ship.upsert(data);
      });
  }
}
