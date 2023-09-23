import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { map, switchMap, startWith, catchError } from 'rxjs/operators';
import { SystemDto } from 'src/app/dtos/systems/system.dto';
import { DatabaseService } from 'src/app/services/database.service';

export class SystemDataSource extends DataSource<SystemDto> {
  private dataSubject = new BehaviorSubject<SystemDto[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  private totalCountSubject = new BehaviorSubject<number>(0);
  public totalCount$ = this.totalCountSubject.asObservable();

  constructor(private _db: DatabaseService, private paginator: MatPaginator, private sort: MatSort) {
    super();
  }

  connect(): Observable<SystemDto[]> {
    const dataMutations = [
      this.paginator.page,
      this.sort.sortChange,
    ];

    merge(...dataMutations)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.loadingSubject.next(true);
          return this._db.db.system.find().$ as Observable<SystemDto[]>;
        }),
        map((data: SystemDto[]) => {
          this.loadingSubject.next(false);
          this.totalCountSubject.next(data.length);
          return this.getPagedData(this.getSortedData([...data]));
        }),
        catchError(() => {
          this.loadingSubject.next(false);
          return [];
        })
      )
      .subscribe((data: SystemDto[]) => this.dataSubject.next(data));

    return this.dataSubject.asObservable();
  }

  disconnect() {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  private getPagedData(data: SystemDto[]): SystemDto[] {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  private getSortedData(data: SystemDto[]): SystemDto[] {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'symbol': return compare(a.symbol, b.symbol, isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        // ...add other sortable properties here
        default: return 0;
      }
    });
  }
}

function compare(a: any, b: any, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
