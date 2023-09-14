import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  if (await authService.isAuthenticated()) {
    return true;
  }
  await authService.signIn(window.location.origin + environment.authRedirectPathname);
  return false;
};
