import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalStateService {
  readonly selectedAgent = signal<{ symbol: string; token: string } | undefined>(undefined);
  readonly allSystemsLoaded = signal<boolean>(false);
  readonly allShipsLoaded = signal<boolean>(false);
}
