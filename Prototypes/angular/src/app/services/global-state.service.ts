import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GlobalStateService {
  readonly selectedAgent = signal<{ symbol: string; token: string } | undefined>(undefined);
}
