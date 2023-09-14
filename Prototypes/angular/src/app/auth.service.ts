import { Injectable } from "@angular/core";
import LogtoClient from "@logto/browser";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly _logtoClient: LogtoClient;
  constructor() {
    this._logtoClient = new LogtoClient({
      endpoint: environment.logToEndpoint,
      appId: environment.logToAppId,
    });
  }

  async handleSignInCallback(callbackUri: string) {
    await this._logtoClient.handleSignInCallback(callbackUri);
  }

  async isAuthenticated() {
    return await this._logtoClient.isAuthenticated();
  }

  async signIn(redirectUri: string) {
    await this._logtoClient.signIn(redirectUri);
  }

  async signOut() {
    await this._logtoClient.signOut(window.location.origin);
  }
}
