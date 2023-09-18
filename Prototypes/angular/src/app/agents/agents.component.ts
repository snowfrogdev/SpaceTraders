import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegisterNewAgentFormComponent, RegisterNewAgentFormResults } from "./register-new-agent-form.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { CommandQueueService } from "../services/command-queue.service";
import { RegisterNewAgentCommand } from "../commands/register-new-agent.handler";
import { AuthService } from "../services/auth.service";
import { DatabaseService } from "../services/database.service";
import { Observable, Subject, interval, map, startWith, switchMap, takeUntil } from "rxjs";
import { GetPublicAgentCommand } from "../commands/get-my-agents.handler";
import { AgentDto } from "../dtos/agent.dto";
import { WaypointLinkComponent } from "../waypoint-link/waypoint-link.component";

@Component({
  selector: "app-agents",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatDialogModule, MatButtonModule, MatIconModule, WaypointLinkComponent],
  template: `
    <h2>My Agents</h2>
    <table mat-table [dataSource]="myAgents$" class="mat-elevation-z8 demo-table">
      <ng-container matColumnDef="symbol">
        <th mat-header-cell *matHeaderCellDef>Symbol</th>
        <td mat-cell *matCellDef="let element">{{ element.symbol }}</td>
      </ng-container>

      <ng-container matColumnDef="headquarters">
        <th mat-header-cell *matHeaderCellDef>Headquarters</th>
        <td mat-cell *matCellDef="let element"><app-waypoint-link>{{ element.headquarters }}</app-waypoint-link></td>
      </ng-container>

      <ng-container matColumnDef="credits">
        <th mat-header-cell *matHeaderCellDef>Credits</th>
        <td mat-cell *matCellDef="let element">{{ element.credits }}</td>
      </ng-container>

      <ng-container matColumnDef="startingFaction">
        <th mat-header-cell *matHeaderCellDef>Starting Faction</th>
        <td mat-cell *matCellDef="let element">{{ element.startingFaction }}</td>
      </ng-container>

      <ng-container matColumnDef="shipCount">
        <th mat-header-cell *matHeaderCellDef>Ship Count</th>
        <td mat-cell *matCellDef="let element">{{ element.shipCount }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        (click)="selectedAgent = row"
        [class.row-is-clicked]="row.symbol === selectedAgent?.symbol"
        *matRowDef="let row; columns: displayedColumns"
      ></tr>
    </table>
    <button mat-fab (click)="openDialog()"><mat-icon>add</mat-icon></button>
  `,
  styles: [
    `
      button[mat-fab] {
        position: fixed;
        bottom: 20px;
        right: 20px;
      }

      .mat-mdc-row .mat-mdc-cell {
        border-bottom: 1px solid transparent;
        border-top: 1px solid transparent;
        cursor: pointer;
      }

      .mat-mdc-row:hover .mat-mdc-cell {
        border-color: currentColor;
      }

      .row-is-clicked {
        font-weight: bold;
      }
    `,
  ],
})
export class AgentsComponent implements OnInit, OnDestroy {
  myAgentsSymbolTokenMap$!: Observable<{ symbol: string; token: string }[]>;
  myAgents$!: Observable<AgentDto[]>;
  displayedColumns: string[] = ["symbol", "headquarters", "credits", "startingFaction", "shipCount"];
  selectedAgent: AgentDto | null = null;
  private _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly _dialog: MatDialog,
    private readonly _queue: CommandQueueService,
    private readonly _authService: AuthService,
    private readonly _db: DatabaseService
  ) {}

  async ngOnInit(): Promise<void> {
    const user = await this._authService.getUser();
    if (!user) {
      throw new Error("User not found");
    }
    this.myAgentsSymbolTokenMap$ = this._db.db.user.findOne(user.id).$.pipe(map((user) => user?.agents ?? []));

    this.myAgents$ = this.myAgentsSymbolTokenMap$.pipe(
      switchMap((agents) => {
        const agentSymbols = agents.map((a) => a.symbol);
        return this._db.db.agent.find().where("symbol").in(agentSymbols).$;
      }),
      map((agentMap) => {
        return [...agentMap.values()];
      })
    );

    // every 15 seconds, send a command to the server to get the latest agent data
    this.myAgentsSymbolTokenMap$
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((agents) =>
          interval(15000).pipe(
            startWith(0),
            map(() => agents)
          )
        )
      )
      .subscribe((agents) => {
        for (const { symbol } of agents) {
          const command = new GetPublicAgentCommand(symbol);
          this._queue.enqueue(command);
        }
      });
  }

  openDialog() {
    const dialogRef = this._dialog.open<RegisterNewAgentFormComponent, void, RegisterNewAgentFormResults>(
      RegisterNewAgentFormComponent
    );

    dialogRef.afterClosed().subscribe(async (result) => {
      if (!result) {
        return;
      }

      const command = new RegisterNewAgentCommand(result.symbol, result.faction, result.email);
      const commandIsQueued = await this._queue.enqueue(command);

      if (!commandIsQueued) {
        throw new Error("Command was not queued");
      }
    });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
