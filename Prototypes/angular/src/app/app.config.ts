import { APP_INITIALIZER, ApplicationConfig, InjectionToken } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { DatabaseService, initDatabase } from "./database.service";
import { DualTokenBucket } from "./token-bucket";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: () => initDatabase,
      multi: true,
      deps: [
        /* your dependencies */
      ],
    },
    DatabaseService,
    {
      provide: DualTokenBucket,
      useFactory: () => new DualTokenBucket(2, 2, 10, 1),
    },
  ],
};
