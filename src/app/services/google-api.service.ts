import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: 'alexis.delaunay.angers.mds-project.fr',
  postLogoutRedirectUri: 'alexis.delaunay.angers.mds-project.fr',
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

  constructor(private readonly oAuthService: OAuthService) {
    oAuthService.configure(oAuthConfig);
    oAuthService.loadDiscoveryDocument().then(() => {
      oAuthService.tryLoginImplicitFlow().then(() => {
        if (oAuthService.hasValidAccessToken()) {
          oAuthService.loadUserProfile().then((userProfile) => {
            this.userProfileSubject.next(userProfile as UserInfo);
          });
        }
        //  else {
        //    oAuthService.initLoginFlow();
        // }
      });
    });
  }

  getUserId(): string | null {
    const userProfile = this.oAuthService.getIdentityClaims();
    if (userProfile) {
      return userProfile['sub']; // 'sub' est l'ID de l'utilisateur dans OpenID Connect
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken();
  }
  signIn() {
    this.oAuthService.initLoginFlow();
  }

  signOut() {
    this.oAuthService.revokeTokenAndLogout();
  }
}
