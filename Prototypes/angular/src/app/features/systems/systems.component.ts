import { AfterViewInit, ChangeDetectionStrategy, Component, ViewChild } from "@angular/core";
import { MatTableModule, MatTable } from "@angular/material/table";
import { MatPaginatorModule, MatPaginator } from "@angular/material/paginator";
import { MatSortModule, MatSort } from "@angular/material/sort";
import { SystemDto } from "src/app/dtos/systems/system.dto";
import { SystemDataSource } from "./systems-datasource";
import { DatabaseService } from "src/app/services/database.service";
import { GlobalStateService } from "src/app/services/global-state.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-systems",
  template: `
    <h2>Systems</h2>
    <div class="mat-elevation-z8">
      <table mat-table class="full-width-table" [dataSource]="dataSource ?? []" matSort aria-label="Systems">
        <ng-container matColumnDef="symbol">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Symbol</th>
          <td mat-cell *matCellDef="let system">{{ system.symbol }}</td>
        </ng-container>

        <ng-container matColumnDef="type">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Type</th>
          <td mat-cell *matCellDef="let system">{{ system.type }}</td>
        </ng-container>

        <ng-container matColumnDef="x">
          <th mat-header-cell *matHeaderCellDef>X</th>
          <td mat-cell *matCellDef="let system">{{ system.x }}</td>
        </ng-container>

        <ng-container matColumnDef="y">
          <th mat-header-cell *matHeaderCellDef>Y</th>
          <td mat-cell *matCellDef="let system">{{ system.y }}</td>
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
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatSortModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<SystemDto>;
  dataSource?: SystemDataSource;

  constructor(private readonly _db: DatabaseService, readonly globalState: GlobalStateService) {}

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["symbol", "type", "x", "y"];

  ngAfterViewInit(): void {
    this.dataSource = new SystemDataSource(this._db, this.paginator, this.sort);

    // If user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
  }
}
