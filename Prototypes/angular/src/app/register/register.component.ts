import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { FactionSymbol } from "../dtos/faction/faction-symbol";
import { MatButtonModule } from "@angular/material/button";
import { HttpClient } from "@angular/common/http";
import { environment as env } from "src/environments/environment";
import { Dto } from "../dtos/dto";
import { RegisterNewAgentDto } from "../dtos/register-new-agent.dto";
import { DB, MyDatabse } from "../db";
import { AuthService } from "../auth.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule, MatButtonModule],
  template: `
    <form [formGroup]="form" (submit)="submit()">
      <h1>Register New Agent</h1>

      <mat-form-field appearance="outline">
        <mat-label>Symbol</mat-label>
        <input matInput #symbolInput maxlength="14" placeholder="Ex. BADGER" formControlName="symbol" />
        <mat-hint>3 to 14 characters</mat-hint>
        <mat-hint align="end">{{ symbolInput.value.length }}/14</mat-hint>
        <mat-error *ngIf="form.get('symbol')?.hasError('required')">Symbol is required</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Faction</mat-label>
        <mat-select formControlName="faction">
          <mat-option *ngFor="let faction of factions" [value]="faction">{{ faction }}</mat-option>
          <mat-error *ngIf="form.get('faction')?.hasError('required')">Faction is required</mat-error>
        </mat-select>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Email</mat-label>
        <input matInput type="email" placeholder="Ex. my@email.com" formControlName="email" />
        <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
        <mat-error *ngIf="form.get('email')?.hasError('email')">Not a valid email</mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline">
        <mat-label>Password</mat-label>
        <input matInput #passwordInput type="password" formControlName="password" />
        <mat-hint>Min 6 characters</mat-hint>
        <mat-hint align="end">{{ passwordInput.value.length }}</mat-hint>
        <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
      </mat-form-field>

      <div id="form-buttons">
        <button mat-raised-button color="primary">Register</button>
        <a mat-button routerLink="/login">Login</a>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
      }

      form {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 500px;
      }

      mat-form-field {
        width: 100%;
      }

      #form-buttons {
        display: flex;
        gap: 10px;
        width: 100%;
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
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
    symbol: FormControl<string | null>;
    faction: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(
    private readonly _fb: FormBuilder,
    private readonly _http: HttpClient,
    @Inject(DB) private readonly _db: MyDatabse,

    private readonly _authService: AuthService
  ) {}

  ngOnInit(): void {
    this.form = this.form = this._fb.group({
      symbol: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(14)]],
      faction: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    });
  }

  submit(): void {
    if (!this.form.valid) {
      return;
    }

    const body = {
      faction: this.form.get("faction")?.value ?? "",
      symbol: this.form.get("symbol")?.value ?? "",
      email: this.form.get("email")?.value ?? "",
    };

    this._http.post<Dto<RegisterNewAgentDto>>(`${env.apiUrl}/register`, body).subscribe((dto) => {
      this._db.users.insert({
        symbol: dto.data.agent.symbol,
        faction: dto.data.faction.symbol,
        email: this.form.get("email")?.value ?? "",
        password: this.form.get("password")?.value ?? "",
        token: dto.data.token,
      });
    });
  }

  async signIn() {
    await this._authService.signIn("http://localhost:4200/callback");
  }
}
