import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: "app-waypoint-link",
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a mat-button (click)="navigate($event)"
      ><span #contentWrapper><ng-content></ng-content></span
    ></a>
  `,
  styles: [],
})
export class WaypointLinkComponent {
  @ViewChild("contentWrapper", { static: false }) contentWrapper!: ElementRef;
  waypoint!: string;

  constructor(private readonly _router: Router) {}

  ngAfterViewInit() {
    this.waypoint = this.contentWrapper.nativeElement.textContent.trim();
  }

  navigate(event: MouseEvent) {
    event.stopPropagation();
    this._router.navigate(["/waypoints", this.waypoint]);
  }
}
