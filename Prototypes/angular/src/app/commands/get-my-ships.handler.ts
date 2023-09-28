import { HttpClient, HttpParams } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { ListDto } from "../dtos/list.dto";
import { CommandQueueService } from "../services/command-queue.service";
import { GlobalStateService } from "../services/global-state.service";
import { Injector } from "@angular/core";
import { ShipDto } from "../dtos/fleet/ship.dto";

export class GetMyShipsCommand extends Command {
  constructor(readonly agentSymbol: string, readonly agentToken: string, readonly page: number = 1) {
    super();
  }
}

export class GetMyShipsHandler implements CommandHandler<GetMyShipsCommand> {
  handles = GetMyShipsCommand;
  private _queue?: CommandQueueService;

  constructor(
    private readonly _http: HttpClient,
    private readonly _db: DatabaseService,
    private readonly _globalState: GlobalStateService,
    private readonly injector: Injector
  ) {}

  async handle(command: GetMyShipsCommand): Promise<void> {
    if (!this._queue) {
      this._queue = this.injector.get(CommandQueueService);
    }

    const headers = {
      Authorization: `Bearer ${command.agentToken}`,
    };

    const params = new HttpParams().set("limit", "20").set("page", command.page.toString());

    this._http.get<ListDto<ShipDto>>(`${environment.apiUrl}/my/ships`, { params, headers }).subscribe({
      next: async (dto) => {
        const data = dto.data.map((ship) => {
          return {
            ...ship,
            agentSymbol: command.agentSymbol,
          };
        });
        await this._db.db.ship.bulkUpsert(data);

        const dbCount = await this._db.db.ship.count().exec();
        if (dbCount >= dto.meta.total) {
          this._globalState.allShipsLoaded.set(true);
          return;
        }

        this._queue!.enqueue(new GetMyShipsCommand(command.agentSymbol, command.agentToken, command.page + 1));
      },
      error: (error) => {
        console.error(error);
        this._queue!.enqueue(new GetMyShipsCommand(command.agentSymbol, command.agentToken, command.page));
      },
    });
  }
}
