import { APP_INITIALIZER, ApplicationConfig, Injector, forwardRef } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClient, provideHttpClient } from "@angular/common/http";

import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { DatabaseService, initDatabase } from "./services/database.service";
import { DualTokenBucketService } from "./services/token-bucket.service";
import { CommandMediatorService } from "./services/command-mediator.service";
import { RegisterNewAgentHandler } from "./commands/register-new-agent.handler";
import { CommandQueueService } from "./services/command-queue.service";
import { AuthService } from "./services/auth.service";
import { GetPublicAgentHandler } from "./commands/get-public-agent.handler";
import { GetWaypointHandler } from "./commands/get-waypoint.handler";
import { GetMyContractsHandler } from "./commands/get-my-contracts.handler";
import { AcceptContractHandler } from "./commands/accept-contract.handler";
import { GetSystemsHandler } from "./commands/get-systems.handler";
import { GlobalStateService } from "./services/global-state.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initDatabase,
      multi: true,
    },
    DatabaseService,
    {
      provide: DualTokenBucketService,
      useValue: new DualTokenBucketService(2, 2, 10, 1),
    },
    {
      provide: CommandMediatorService,
      useFactory: (
        http: HttpClient,
        auth: AuthService,
        db: DatabaseService,
        globalState: GlobalStateService,
        injector: Injector
      ) => {
        return new CommandMediatorService([
          new RegisterNewAgentHandler(http, auth, db),
          new GetPublicAgentHandler(http, db),
          new GetWaypointHandler(http, db),
          new GetMyContractsHandler(http, db),
          new AcceptContractHandler(http, db),
          new GetSystemsHandler(http, db, globalState, injector),
        ]);
      },
      deps: [HttpClient, AuthService, DatabaseService, GlobalStateService, Injector],
    },
    {
      provide: CommandQueueService,
      useFactory: (tokenBucket: DualTokenBucketService, mediator: CommandMediatorService) => {
        const queue = new CommandQueueService(tokenBucket, mediator);
        queue.startExecutingCommands();
        return queue;
      },
      deps: [DualTokenBucketService, CommandMediatorService],
    },
  ],
};
