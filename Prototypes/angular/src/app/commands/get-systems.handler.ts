import { HttpClient, HttpParams } from "@angular/common/http";
import { Command } from "../services/command";
import { CommandHandler } from "../services/command-handler";
import { environment } from "src/environments/environment";
import { DatabaseService } from "../services/database.service";
import { ListDto } from "../dtos/list.dto";
import { SystemDto } from "../dtos/systems/system.dto";
import { CommandQueueService } from "../services/command-queue.service";
import { GlobalStateService } from "../services/global-state.service";
import { Injector, inject } from "@angular/core";

export class GetSystemsCommand extends Command {
  constructor(readonly page: number = 1) {
    super();
  }
}

export class GetSystemsHandler implements CommandHandler<GetSystemsCommand> {
  handles = GetSystemsCommand;
  private _queue?: CommandQueueService;

  constructor(
    private readonly _http: HttpClient,
    private readonly _db: DatabaseService,
    private readonly _globalState: GlobalStateService,
    private readonly injector: Injector
  ) { }

  async handle(command: GetSystemsCommand): Promise<void> {
    if (!this._queue) {
      this._queue = this.injector.get(CommandQueueService);
    }

    const params = new HttpParams().set("limit", "20").set("page", command.page.toString());

    this._http.get<ListDto<SystemDto>>(`${environment.apiUrl}/systems`, { params }).subscribe({
      next: async (dto) => {
        await this._db.db.system.bulkUpsert(dto.data);

        const dbCount = await this._db.db.system.count().exec();
        if (dbCount >= dto.meta.total) {
          this._globalState.allSystemsLoaded.set(true);
          return;
        }

        this._queue!.enqueue(new GetSystemsCommand(command.page + 1));
      },
      error: (error) => {
        console.error(error);
        this._queue!.enqueue(new GetSystemsCommand(command.page));
      },
    });
  }
}
