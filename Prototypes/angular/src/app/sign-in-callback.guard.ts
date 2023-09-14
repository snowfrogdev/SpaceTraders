import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { environment } from "src/environments/environment";

export const signInCallbackGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  try {
    await authService.handleSignInCallback(window.location.href);
    router.navigate([""]);
    return true;
  } catch (error) {
    await authService.signIn(window.location.origin + environment.authRedirectPathname);
    return false;
  }
};
