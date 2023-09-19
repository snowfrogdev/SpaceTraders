import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GlobalStateService } from "./global-state.service";
import { AuthService } from "./auth.service";

export const agentSelectedGuard: CanActivateFn = async (route, state) => {
  const globalState = inject(GlobalStateService);
  const authService = inject(AuthService);
  const router = inject(Router);

  const agent = globalState.selectedAgent();
  if (!agent) {
    const user = await authService.getUser();
    if (user?.agents.length === 0) {
      router.navigate(["/agents"]);
      return false;
    }

    globalState.selectedAgent.set(user?.agents[0]);
  }

  return true;
};
