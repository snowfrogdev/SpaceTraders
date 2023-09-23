import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { WaypointDto } from "../../dtos/systems/waypoint.dto";
import { DatabaseService } from "../../services/database.service";
import { Observable, Subject, interval, map, startWith, switchMap, takeUntil, tap } from "rxjs";
import { GetWaypointCommand } from "../../commands/get-waypoint.handler";
import { CommandQueueService } from "../../services/command-queue.service";

@Component({
  selector: "app-waypoint-details",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <h2>Waypoint Details</h2>
    <pre>{{ waypointDetails$ | async | json }}</pre>
  `,
  styles: [],
})
export class WaypointDetailsComponent implements OnInit, OnDestroy {
  waypointDetails$!: Observable<WaypointDto | null>;
  waypointSymbol$!: Observable<string>;
  private readonly _unsubscribeAll = new Subject<void>();
  constructor(
    private readonly _route: ActivatedRoute,
    private readonly _db: DatabaseService,
    private readonly _queue: CommandQueueService
  ) {}

  ngOnInit(): void {
    this.waypointSymbol$ = this._route.paramMap.pipe(
      takeUntil(this._unsubscribeAll),
      map((params) => params.get("waypointSymbol")!)
    );
    this.waypointDetails$ = this.waypointSymbol$.pipe(
      takeUntil(this._unsubscribeAll),
      switchMap(
        (symbol) =>
          this._db.db.waypoint.findOne(symbol).$.pipe(takeUntil(this._unsubscribeAll)) as Observable<WaypointDto | null>
      )
    );

    // every 15 seconds, send a command to the server to get data related to this waypoint
    this.waypointSymbol$
      .pipe(
        takeUntil(this._unsubscribeAll),
        switchMap((symbol) =>
          interval(15000).pipe(
            takeUntil(this._unsubscribeAll),
            startWith(0),
            map(() => symbol)
          )
        )
      )
      .subscribe((symbol) => {
        const [sectorSymbol, systemSymbol, waypointSymbol] = symbol.split("-");
        const command = new GetWaypointCommand(`${sectorSymbol}-${systemSymbol}`, symbol);
        command.scheduledTime = new Date(0);
        this._queue.enqueue(command);
      });
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
