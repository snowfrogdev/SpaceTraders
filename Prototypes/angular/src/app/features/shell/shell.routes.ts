import { Route } from "@angular/router";
import { agentSelectedGuard } from "src/app/services/agent-selected.guard";

export default [
  {
    path: "",
    loadComponent: () => import("./shell.component").then((module) => module.ShellComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("../dashboard/dashboard.component").then((module) => module.DashboardComponent),
        canActivate: [agentSelectedGuard],
      },
      {
        path: "agents",
        loadComponent: () => import("../agents/agents.component").then((module) => module.AgentsComponent),
      },
      {
        path: "ships",
        loadComponent: () => import("../ships/ships.component").then((module) => module.ShipsComponent),
        canActivate: [agentSelectedGuard],
      },
      {
        path: "systems",
        loadComponent: () => import("../systems/systems.component").then((module) => module.SystemsComponent),
        canActivate: [agentSelectedGuard],
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
        canActivate: [agentSelectedGuard],
      },
      {
        path: "waypoints",
        loadComponent: () => import("../waypoints/waypoints.component").then((module) => module.WaypointsComponent),
        canActivate: [agentSelectedGuard],
      },
      {
        path: "waypoints/:waypointSymbol",
        loadComponent: () =>
          import("../waypoint-details/waypoint-details.component").then((module) => module.WaypointDetailsComponent),
        canActivate: [agentSelectedGuard],
      },
      {
        path: "contracts",
        loadComponent: () => import("../contracts/contracts.component").then((module) => module.ContractsComponent),
        canActivate: [agentSelectedGuard],
      },
      { path: "**", redirectTo: "" },
    ],
  },
] as Route[];
