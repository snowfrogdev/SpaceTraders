import { Injectable } from "@angular/core";
import LogtoClient from "@logto/browser";
import { environment } from "src/environments/environment";
import { DatabaseService } from "./database.service";
import { RxUserDocument } from "./schemas/user.schema";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private user: RxUserDocument | null = null;
  private readonly _logtoClient: LogtoClient;
  constructor(private readonly _dbService: DatabaseService) {
    this._logtoClient = new LogtoClient({
      endpoint: environment.logToEndpoint,
      appId: environment.logToAppId,
    });
  }

  async handleSignInCallback(callbackUri: string) {
    await this._logtoClient.handleSignInCallback(callbackUri);
    const userInfo = await this._logtoClient.fetchUserInfo();
    this._dbService.db.user.upsert({ id: userInfo.sub, userName: userInfo.name! });
  }

  async isAuthenticated(): Promise<boolean> {
    return await this._logtoClient.isAuthenticated();
  }

  async signIn(redirectUri: string): Promise<void> {
    await this._logtoClient.signIn(redirectUri);
  }

  async signOut(): Promise<void> {
    this.user = null;
    await this._logtoClient.signOut(window.location.origin);
  }

  async getUser(): Promise<RxUserDocument | null> {
    if (!this.user) {
      const userInfo = await this._logtoClient.fetchUserInfo();
      this.user = await this._dbService.db.user.findOne({ selector: { id: userInfo.sub } }).exec();
    }

    return this.user;
  }
}
