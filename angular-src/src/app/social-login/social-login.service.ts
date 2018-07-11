import { Injectable } from '@angular/core';
import { AuthService as SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { Subject } from 'rxjs/Subject';

import { ApiService, AuthService } from '../core/services';
import { UserProfile } from '../../../../shared/models';

@Injectable()
export class SocialLoginService {
  loginStateChanged: Subject<UserProfile> = new Subject<UserProfile>();

  constructor(private socialAuthService: SocialAuthService,
    private authService: AuthService) {
    this.registerAuthStateChanges();
  }

  registerAuthStateChanges() {
    this.socialAuthService.authState.subscribe(socialUser => {
      if (socialUser) {
        const authToken = socialUser.authToken;
        const provider = socialUser.provider.toLowerCase();

        // After the social login succeded, signout from the social service
        this.authService.socialLogin(provider, authToken).then(result => {
          this.socialAuthService.signOut().then(() => {
            this.loginStateChanged.next(result);
          });

        }).catch(
          error => {
            this.loginStateChanged.error(error);
          }
        );
      }
    });
  }

  signIn(provider: string) {
    switch (provider) {
      case 'google':
        return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      case 'facebook':
        return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }
}
