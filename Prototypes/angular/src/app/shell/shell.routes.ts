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
      { path: "**", redirectTo: "" },
    ],
  },
] as Route[];
