import { Component, isDevMode } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { addRxPlugin } from "rxdb";
import { RxDBDevModePlugin } from "rxdb/plugins/dev-mode";
import { AuthService } from "./auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [],
})
export class AppComponent {
  constructor(private readonly _authService: AuthService) {}

  async ngOnInit() {
    if (isDevMode()) {
      addRxPlugin(RxDBDevModePlugin);
    }
  }
}
