import { ApplicationConfig, InjectionToken } from "@angular/core";
import { provideRouter, withDebugTracing } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { routes } from "./app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";
import { DB, createDB } from "./db";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    {
      provide: DB,
      useFactory: createDB,
    },
  ],
};
