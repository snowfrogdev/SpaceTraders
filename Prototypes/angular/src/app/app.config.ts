import { APP_INITIALIZER, ApplicationConfig } from "@angular/core";
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
import { GetPublicAgentHandler } from "./commands/get-my-agents.handler";
import { GetWaypointHandler } from "./commands/get-waypoint.handler";

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
      useFactory: (http: HttpClient, auth: AuthService, db: DatabaseService) => {
        return new CommandMediatorService([
          new RegisterNewAgentHandler(http, auth, db),
          new GetPublicAgentHandler(http, db),
          new GetWaypointHandler(http, db),
        ]);
      },
      deps: [HttpClient, AuthService, DatabaseService],
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
