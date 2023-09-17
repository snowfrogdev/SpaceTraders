import { Component } from "@angular/core";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { Observable } from "rxjs";
import { map, shareReplay } from "rxjs/operators";
import { CommonModule } from "@angular/common";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-shell",
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="(isHandset$ | async) === false"
      >
        <mat-toolbar>Menu</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/agents" routerLinkActive="active" ariaCurrentWhenActive="page">Agents</a>
          <a mat-list-item href="#">Link 2</a>
          <a mat-list-item href="#">Link 3</a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async"
          >
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <a mat-button routerLink=""><span class="mat-toolbar">SpaceTraders Manager</span></a>
          <span class="spacer"></span>
          <button type="button" mat-icon-button aria-label="Logout" (click)="logout()">
            <mat-icon aria-label="Logout icon">logout</mat-icon>
          </button>
        </mat-toolbar>
        <main>
          <router-outlet></router-outlet>
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .sidenav {
        width: 200px;
      }

      .sidenav .mat-toolbar {
        background: inherit;
      }

      .mat-toolbar.mat-primary {
        position: sticky;
        top: 0;
        z-index: 1;
      }

      .spacer {
        flex: 1 1 auto;
      }

      main {
        padding-left: 1rem;
        padding-right: 1rem;
      }

      .active {
        font-weight: bold;
        background-color: rgb(245, 207, 61);
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
})
export class ShellComponent {
  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset).pipe(
    map((result) => result.matches),
    shareReplay()
  );

  constructor(private readonly _breakpointObserver: BreakpointObserver, private readonly _authService: AuthService) {}

  logout() {
    this._authService.signOut();
  }
}
