import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ContractDto } from "src/app/dtos/contracts/contract.dto";
import { Observable, Subject, interval, map, startWith, switchMap, takeUntil } from "rxjs";
import { DatabaseService } from "src/app/services/database.service";
import { GlobalStateService } from "src/app/services/global-state.service";
import { GetMyContractsCommand } from "src/app/commands/get-my-contracts.handler";
import { CommandQueueService } from "src/app/services/command-queue.service";
import { MatTableModule } from "@angular/material/table";

@Component({
  selector: "app-contracts",
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: `
    <h2>My Contracts</h2>
    <table mat-table [dataSource]="myContracts$" class="mat-elevation-z8 demo-table">
      <ng-container matColumnDef="factionSymbol">
        <th mat-header-cell *matHeaderCellDef>Faction</th>
        <td mat-cell *matCellDef="let element">{{ element.factionSymbol }}</td>
      </ng-container>

      <ng-container matColumnDef="type">
        <th mat-header-cell *matHeaderCellDef>Type</th>
        <td mat-cell *matCellDef="let element">{{ element.type }}</td>
      </ng-container>

      <ng-container matColumnDef="payment">
        <th mat-header-cell *matHeaderCellDef>Payment</th>
        <td mat-cell *matCellDef="let element">
          {{ element.terms.payment.onAccepted + element.terms.payment.onFulfilled }}
        </td>
      </ng-container>

      <ng-container matColumnDef="deliver">
        <th mat-header-cell *matHeaderCellDef>Goods</th>
        <td mat-cell *matCellDef="let element">
          <span *ngFor="let deliver of element.terms.deliver">{{ deliver.tradeSymbol }} </span>
        </td>
      </ng-container>

      <ng-container matColumnDef="accepted">
        <th mat-header-cell *matHeaderCellDef>Accepted</th>
        <td mat-cell *matCellDef="let element">{{ element.accepted }}</td>
      </ng-container>

      <ng-container matColumnDef="fulfilled">
        <th mat-header-cell *matHeaderCellDef>Fulfilled</th>
        <td mat-cell *matCellDef="let element">{{ element.fulfilled }}</td>
      </ng-container>

      <ng-container matColumnDef="deadlineToAccept">
        <th mat-header-cell *matHeaderCellDef>Accept Before</th>
        <td mat-cell *matCellDef="let element">{{ element.deadlineToAccept | date : "medium" }}</td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr
        mat-row
        (click)="selectContrat(row)"
        [class.row-is-clicked]="row.id === selectedContract?.id"
        *matRowDef="let row; columns: displayedColumns"
      ></tr>
    </table>
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
export class ContractsComponent implements OnInit {
  myContracts$!: Observable<ContractDto[]>;
  selectedContract: ContractDto | null = null;
  displayedColumns: string[] = [
    "factionSymbol",
    "type",
    "payment",
    "deliver",
    "accepted",
    "fulfilled",
    "deadlineToAccept",
  ];

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

  selectContrat(contract: ContractDto): void {
    this.selectedContract = contract;
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
