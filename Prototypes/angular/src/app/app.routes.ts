import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";

export const routes: Routes = [
  { path: "login", loadComponent: () => import("./login/login.component").then((module) => module.LoginComponent) },
  { path: "register", loadComponent: () => import("./register/register.component").then((module) => module.RegisterComponent)}
];
