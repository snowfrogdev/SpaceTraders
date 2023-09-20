import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContractDto } from "src/app/dtos/contracts/contract.dto";
import { Observable, Subject, interval, map, startWith, switchMap, takeUntil } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { GlobalStateService } from "src/app/services/global-state.service";
import { GetMyContractsCommand } from "src/app/commands/get-my-contracts.handler";
import { CommandQueueService } from "src/app/services/command-queue.service";
import { MatTableModule } from "@angular/material/table";
import { MatRippleModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { MatButtonModule } from "@angular/material/button";
import { AcceptContractCommand } from "src/app/commands/accept-contract.handler";

@Component({
  selector: "app-contracts",
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatRippleModule, MatIconModule],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition("expanded <=> collapsed", animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")),
    ]),
  ],
  template: `
    <h2>My Contracts</h2>
    <mat-table [dataSource]="myContracts$" class="mat-elevation-z8" multiTemplateDataRows>
      <ng-container matColumnDef="factionSymbol">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Faction</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">{{ element.factionSymbol }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="type">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Type</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">{{ element.type }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="payment">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Payment</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">
          {{ element.terms.payment.onAccepted + element.terms.payment.onFulfilled }}
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="deliver">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Goods</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">
          <span *ngFor="let deliver of element.terms.deliver">{{ deliver.tradeSymbol }} </span>
        </mat-cell>
      </ng-container>

      <ng-container matColumnDef="accepted">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Accepted</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">{{ element.accepted }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="fulfilled">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Fulfilled</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">{{ element.fulfilled }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="deadlineToAccept">
        <mat-header-cell mat-header-cell *matHeaderCellDef>Accept Before</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">{{ element.deadlineToAccept | date : "medium" }}</mat-cell>
      </ng-container>

      <ng-container matColumnDef="expand">
        <mat-header-cell mat-header-cell *matHeaderCellDef aria-label="row actions">&nbsp;</mat-header-cell>
        <mat-cell mat-cell *matCellDef="let element">
          <button
            mat-icon-button
            aria-label="expand row"
            (click)="expandedElement = expandedElement?.id === element.id ? null : element; $event.stopPropagation()"
          >
            <mat-icon *ngIf="expandedElement?.id !== element.id">keyboard_arrow_down</mat-icon>
            <mat-icon *ngIf="expandedElement?.id === element.id">keyboard_arrow_up</mat-icon>
          </button>
        </mat-cell>
      </ng-container>

      <!-- Expanded Content Column - The detail row is made up of this one column that spans across all columns -->
      <ng-container matColumnDef="expandedDetail">
        <mat-cell mat-cell *matCellDef="let element" [attr.colspan]="columnsToDisplayWithExpand.length">
          <div
            class="example-element-detail"
            [@detailExpand]="element?.id == expandedElement?.id ? 'expanded' : 'collapsed'"
          >
            <pre>{{ element | json }}</pre>
            <button *ngIf="!element.accepted" class="accept-button" mat-raised-button color="primary" (click)="acceptContract(element)">
              Accept
            </button>
          </div>
        </mat-cell>
      </ng-container>

      <mat-header-row *matHeaderRowDef="columnsToDisplayWithExpand"></mat-header-row>
      <mat-row
        matRipple
        class="example-element-row"
        (click)="expandedElement = expandedElement?.id === row.id ? null : row"
        [class.example-expanded-row]="expandedElement?.id === row.id"
        *matRowDef="let row; columns: columnsToDisplayWithExpand"
      ></mat-row>
      <mat-row *matRowDef="let row; columns: ['expandedDetail']" class="example-detail-row"></mat-row>
    </mat-table>
  `,
  styles: [
    `
      .mat-mdc-row .mat-mdc-cell {
        border-bottom: 1px solid transparent;
        border-top: 1px solid transparent;
        cursor: pointer;
      }

      .mat-mdc-row:hover .mat-mdc-cell {
        border-color: currentColor;
      }

      tr.example-detail-row {
        height: 0;
      }

      tr.example-element-row:not(.example-expanded-row):hover {
        background: whitesmoke;
      }

      tr.example-element-row:not(.example-expanded-row):active {
        background: #efefef;
      }

      .example-element-row td {
        border-bottom-width: 0;
      }

      .example-element-detail {
        overflow: hidden;
        display: flex;
        gap: 1rem;
      }

      .accept-button {
        align-self: end;
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class ContractsComponent implements OnInit {
  myContracts$!: Observable<ContractDto[]>;
  expandedElement: ContractDto | null = null;
  displayedColumns: string[] = [
    "factionSymbol",
    "type",
    "payment",
    "deliver",
    "accepted",
    "fulfilled",
    "deadlineToAccept",
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, "expand"];

  private _unsubscribeAll = new Subject<void>();

  constructor(
    private readonly _db: DatabaseService,
    private readonly _globalState: GlobalStateService,
    private readonly _queue: CommandQueueService
  ) {}

  ngOnInit(): void {
    if (this._globalState.selectedAgent()) {
      this.myContracts$ = this._db.db.contract
        .find()
        .where("agentSymbol")
        .eq(this._globalState.selectedAgent()?.symbol)
        .$.pipe(takeUntil(this._unsubscribeAll)) as Observable<ContractDto[]>;
    }
    // every 15 seconds, send a command to the server to get my contracts
    interval(15000)
      .pipe(takeUntil(this._unsubscribeAll), startWith(0))

      .subscribe((_) => {
        const command = new GetMyContractsCommand(
          this._globalState.selectedAgent()!.symbol,
          this._globalState.selectedAgent()!.token
        );
        this._queue.enqueue(command);
      });
  }

  acceptContract(contract: ContractDto): void {
    const command = new AcceptContractCommand(contract.id, this._globalState.selectedAgent()!.token);
    this._queue.enqueue(command);
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
