import { Component, Inject, inject } from "@angular/core";

import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatRadioModule } from "@angular/material/radio";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CommonModule } from "@angular/common";
import { FactionSymbol } from "../../dtos/factions/faction-symbol";
import { Command } from "../../services/command";
import { CommandQueueService } from "../../services/command-queue.service";
import { CommandMediatorService } from "../../services/command-mediator.service";

@Component({
  selector: "app-create-new-agent-form",
  template: `
    <form class="form-dialog" [formGroup]="form" (ngSubmit)="onSubmit()">
      <h1 mat-dialog-title>Shipping Information</h1>
      <div mat-dialog-content>
        <div class="row">
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Symbol</mat-label>
            <input matInput #symbolInput maxlength="14" placeholder="Ex. BADGER" formControlName="symbol" />
            <mat-hint>3 to 14 characters</mat-hint>
            <mat-hint align="end">{{ symbolInput.value.length }}/14</mat-hint>
            <mat-error *ngIf="form.get('symbol')?.hasError('required')">Symbol is required</mat-error>
            <mat-error *ngIf="form.get('symbol')?.hasError('pattern')"
              >Only alpha-numeric characters, dashes, and underscores are allowed.</mat-error
            >
          </mat-form-field>
        </div>
        <div class="row">
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Faction</mat-label>
            <mat-select formControlName="faction">
              <mat-option *ngFor="let faction of factions" [value]="faction">{{ faction }}</mat-option>
              <mat-error *ngIf="form.get('faction')?.hasError('required')">Faction is required</mat-error>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field class="full-width" appearance="outline">
            <mat-label>Email</mat-label>
            <input matInput type="email" placeholder="Ex. my@email.com" formControlName="email" />
            <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Not a valid email</mat-error>
          </mat-form-field>
        </div>
      </div>
      <mat-dialog-actions>
        <button mat-raised-button color="primary" type="submit">Register</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [
    `
      .form-dialog {
        width: 100%;
        min-width: 400px;
      }

      .full-width {
        width: 100%;
      }

      .mat-radio-button {
        display: block;
        margin: 5px 0;
      }

      .row {
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
      }

      .col {
        flex: 1;
        margin-right: 20px;
      }

      .col:last-child {
        margin-right: 0;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
})
export class RegisterNewAgentFormComponent {
  readonly factions: FactionSymbol[] = [
    "COSMIC",
    "VOID",
    "GALACTIC",
    "QUANTUM",
    "DOMINION",
    "ASTRO",
    "CORSAIRS",
    "OBSIDIAN",
    "AEGIS",
    "UNITED",
    "SOLITARY",
    "COBALT",
    "OMEGA",
    "ECHO",
    "LORDS",
    "CULT",
    "ANCIENTS",
    "SHADOW",
    "ETHEREAL",
  ];

  form!: FormGroup<{
    symbol: FormControl<string>;
    faction: FormControl<string>;
    email: FormControl<string>;
  }>;

  constructor(
    private readonly _dialogRef: MatDialogRef<RegisterNewAgentFormComponent>,
    private readonly _fb: FormBuilder
  ) {
    this.form = this._fb.nonNullable.group({
      symbol: [
        "",
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(14),
          Validators.pattern(/^[a-zA-Z0-9-_]+$/),
        ],
      ],
      faction: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this._dialogRef.close(this.form.value);
    }
  }
}

export type RegisterNewAgentFormResults = {
  symbol: string;
  faction: string;
  email: string;
};
