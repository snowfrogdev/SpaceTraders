import { Routes } from "@angular/router";
import { authGuard } from "./services/auth.guard";
import { signInCallbackGuard } from "./services/sign-in-callback.guard";
import { NoopComponent } from "./features/noop/noop.component";

export const routes: Routes = [
  { path: "sign-in-callback", canActivate: [signInCallbackGuard], component: NoopComponent },
  {
    path: "",
    canActivate: [authGuard],
    loadChildren: () => import("./features/shell/shell.routes"),
  },
  { path: "**", redirectTo: "" },
];
