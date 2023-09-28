import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { Observable, BehaviorSubject, merge, Subject } from "rxjs";
import { map, switchMap, startWith, catchError, takeUntil } from "rxjs/operators";
import { ShipDto } from "src/app/dtos/fleet/ship.dto";
import { DatabaseService } from "src/app/services/database.service";
import { GlobalStateService } from "src/app/services/global-state.service";

export class ShipsDataSource extends DataSource<ShipDto> {
  public dataSubject = new BehaviorSubject<ShipDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();
  private _unsubscribeAll = new Subject<void>();

  constructor(
    private _db: DatabaseService,
    private _globalState: GlobalStateService,
    private paginator: MatPaginator,
    private sort: MatSort
  ) {
    super();
  }

  connect(): Observable<ShipDto[]> {
    const dataMutations = [this.paginator.page, this.sort.sortChange];

    merge(...dataMutations)
      .pipe(
        takeUntil(this._unsubscribeAll),
        startWith({}),
        switchMap(() => {
          this.loadingSubject.next(true);
          return this._db.db.ship.find().where("agentSymbol").eq(this._globalState.selectedAgent()?.symbol)
            .$ as Observable<ShipDto[]>;
        }),
        map((data: ShipDto[]) => {
          this.loadingSubject.next(false);
          this.totalCountSubject.next(data.length);
          return this.getPagedData(this.getSortedData([...data]));
        }),
        catchError(() => {
          this.loadingSubject.next(false);
          return [];
        })
      )
      .subscribe((data: ShipDto[]) => this.dataSubject.next(data));

    return this.dataSubject.asObservable();
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  private getPagedData(data: ShipDto[]): ShipDto[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: ShipDto[]): ShipDto[] {
    if (!this.sort.active || this.sort.direction === "") {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === "asc";
      switch (this.sort.active) {
        case "symbol":
          return compare(a.symbol, b.symbol, isAsc);
        case "name":
          return compare(a.registration.name, b.registration.name, isAsc);
        case "role":
          return compare(a.registration.role, b.registration.role, isAsc);
        case "frame":
          return compare(a.frame.symbol, b.frame.symbol, isAsc);
        case "cargo":
          return compare(a.cargo.units / a.cargo.capacity, b.cargo.units / b.cargo.capacity, isAsc);
        case "fuel":
          return compare(a.fuel.current / a.fuel.capacity, b.fuel.current / b.fuel.capacity, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
