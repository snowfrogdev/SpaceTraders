import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
  template: ` <router-outlet></router-outlet> `,
  styles: [],
})
export class AppComponent {
  title = "angular";

  constructor() {}
}
