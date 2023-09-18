import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";

@Component({
  selector: "app-waypoint-link",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a (click)="navigate()"
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

  navigate() {
    this._router.navigate(['/waypoints', this.waypoint]);
  }
}
