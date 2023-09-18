import { Route } from "@angular/router";

export default [
  {
    path: "",
    loadComponent: () => import("../shell/shell.component").then((module) => module.ShellComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("../dashboard/dashboard.component").then((module) => module.DashboardComponent),
      },
      {
        path: "agents",
        loadComponent: () => import("../agents/agents.component").then((module) => module.AgentsComponent),
      },
      {
        path: "systems",
        loadComponent: () => import("../systems/systems.component").then((module) => module.SystemsComponent),
      },
      {
        path: "systems/:systemSymbol",
        loadComponent: () =>
          import("../system-details/system-details.component").then((module) => module.SystemDetailsComponent),
        loadChildren: () => [
          {
            path: "waypoints",
            loadComponent: () => import("../waypoints/waypoints.component").then((module) => module.WaypointsComponent),
          },
        ],
      },
      {
        path: "waypoints",
        loadComponent: () => import("../waypoints/waypoints.component").then((module) => module.WaypointsComponent),
      },
      {
        path: "waypoints/:waypointSymbol",
        loadComponent: () =>
          import("../waypoint-details/waypoint-details.component").then((module) => module.WaypointDetailsComponent),
      },
      { path: "**", redirectTo: "" },
    ],
  },
] as Route[];
