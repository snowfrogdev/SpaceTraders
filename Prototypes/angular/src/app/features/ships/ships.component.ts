import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatTableModule, MatTable } from "@angular/material/table";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { SystemDto } from "src/app/dtos/systems/system.dto";
import { ShipsDataSource } from "./ships-datasource";
import { DatabaseService } from "src/app/services/database.service";
import { GlobalStateService } from "src/app/services/global-state.service";
import { CommonModule } from "@angular/common";
import { Subject, interval, startWith, takeUntil } from "rxjs";
import { CommandQueueService } from "src/app/services/command-queue.service";
import { GetMyShipCommand } from "src/app/commands/get-my-ship.handler";
import { WaypointLinkComponent } from "../waypoint-link/waypoint-link.component";

@Component({
  selector: "app-ships",
  template: `
    <h2>Ships</h2>
    <div class="mat-elevation-z8">
      <table mat-table class="full-width-table" [dataSource]="dataSource ?? []" matSort aria-label="Systems">
        <ng-container matColumnDef="symbol">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Symbol</th>
          <td mat-cell *matCellDef="let ship">{{ ship.symbol }}</td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Name</th>
          <td mat-cell *matCellDef="let ship">{{ ship.registration.name }}</td>
        </ng-container>

        <ng-container matColumnDef="role">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Role</th>
          <td mat-cell *matCellDef="let ship">{{ ship.registration.role }}</td>
        </ng-container>

        <ng-container matColumnDef="waypoint">
          <th mat-header-cell *matHeaderCellDef>Waypoint</th>
          <td mat-cell *matCellDef="let ship"><app-waypoint-link>{{ ship.nav.waypointSymbol }}</app-waypoint-link></td>
        </ng-container>

        <ng-container matColumnDef="frame">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Frame</th>
          <td mat-cell *matCellDef="let ship">{{ ship.frame.symbol }}</td>
        </ng-container>

        <ng-container matColumnDef="cargo">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Cargo (%)</th>
          <td mat-cell *matCellDef="let ship">{{ getPercentage(ship.cargo.units, ship.cargo.capacity) }}</td>
        </ng-container>

        <ng-container matColumnDef="fuel">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Fuel (%)</th>
          <td mat-cell *matCellDef="let ship">{{ getPercentage(ship.fuel.current, ship.fuel.capacity) }}</td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
      </table>

      <mat-paginator
        #paginator
        [length]="dataSource?.totalCount$ | async"
        [pageIndex]="0"
        [pageSize]="10"
        [pageSizeOptions]="[5, 10, 20]"
        aria-label="Select page"
      >
      </mat-paginator>
    </div>
  `,
  styles: [
    `
      .full-width-table {
        width: 100%;
      }
    `,
  ],
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule, WaypointLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShipsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SystemDto>;
  dataSource?: ShipsDataSource;
  private _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly _db: DatabaseService,
    readonly _globalState: GlobalStateService,
    private readonly _queue: CommandQueueService
  ) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["symbol", "name", "role", "waypoint", "frame", "cargo", "fuel"];

  ngAfterViewInit(): void {
    this.dataSource = new ShipsDataSource(this._db, this._globalState, this.paginator, this.sort);

    // If user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }

  ngOnInit(): void {
    // every 15 seconds, send a command to the server to get my currently displayed ships
    interval(15000)
      .pipe(takeUntil(this._unsubscribeAll), startWith(0))

      .subscribe((_) => {
        this.dataSource?.dataSubject.value.forEach((ship) => {
          const command = new GetMyShipCommand(
            ship.symbol,
            this._globalState.selectedAgent()!.symbol,
            this._globalState.selectedAgent()!.token
          );
          command.scheduledTime = new Date(0);
          this._queue.enqueue(command);
        });
      });
  }

  getPercentage(value: number, max: number): number | string {
    let percentage = Math.round((value / max) * 100);
    if (isNaN(percentage)) return "N/A";
    return percentage;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
