import { HttpClient } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { Dto } from "../dtos/dto";
import { WaypointDto } from "../dtos/systems/waypoint.dto";

export class GetWaypointCommand extends Command {
  constructor(public readonly systemSymbol: string, public readonly waypointSymbol: string) {
    super();
  }
}

export class GetWaypointHandler implements CommandHandler<GetWaypointCommand> {
  handles = GetWaypointCommand;

  constructor(private readonly _http: HttpClient, private readonly _db: DatabaseService) {}
  async handle(command: GetWaypointCommand): Promise<void> {
    this._http
      .get<Dto<WaypointDto>>(
        `${environment.apiUrl}/systems/${command.systemSymbol}/waypoints/${command.waypointSymbol}`
      )
      .subscribe(async (dto) => {
        await this._db.db.waypoint.upsert(dto.data);
      });
  }
}
