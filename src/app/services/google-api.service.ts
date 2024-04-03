import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: 'http://alexis.delaunay.angers.mds-project.fr', // Prod
  postLogoutRedirectUri: 'http://alexis.delaunay.angers.mds-project.fr', // Prod
  // redirectUri: 'http://localhost:4200', // Dev
  // postLogoutRedirectUri: 'http://localhost:4200', // Dev
  clientId:
    '848215415699-dpqbjtio7t282mrukl65di7pqdbu9628.apps.googleusercontent.com',
  scope: 'openid profile',
};

export interface UserInfo {
  info: {
    sub: string;
    given_name: string;
    picture: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  userProfileSubject = new Subject<UserInfo>();
  private userIdSubject = new BehaviorSubject<string | null>(null);

  constructor(private readonly oAuthService: OAuthService) {
    this.oAuthService.configure(oAuthConfig);
    this.initializeAuth();
  }

  private initializeAuth() {
    if (typeof window !== 'undefined') {
      this.oAuthService.loadDiscoveryDocument().then(() => {
        this.oAuthService.tryLoginImplicitFlow().then(() => {
          if (this.oAuthService.hasValidAccessToken()) {
            this.oAuthService.loadUserProfile().then((userProfile) => {
              this.userProfileSubject.next(userProfile as UserInfo);
              const userId = this.getUserId();
              this.userIdSubject.next(userId);
            });
          }
          // else {
          //   this.oAuthService.initLoginFlow();
          // }
        });
      });
    }
  }

  getUserId(): string | null {
    const userProfile = this.oAuthService.getIdentityClaims();
    if (userProfile) {
      return userProfile['sub'];
    }
    return null;
  }

  getUserIdObservable(): Observable<string | null> {
    return this.userIdSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }

  signIn() {
    this.oAuthService.initLoginFlow();
  }

  signOut() {
    this.oAuthService.revokeTokenAndLogout();
    this.userIdSubject.next(null);
  }
}
