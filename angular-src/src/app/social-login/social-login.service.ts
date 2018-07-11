import { Injectable } from '@angular/core';
import { AuthService as SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { Subject, Subscription } from 'rxjs';

import { ApiService, AuthService } from '../core/services';
import { UserProfile } from '../../../../shared/models';

@Injectable()
export class SocialLoginService {
  socialAuthStateSubscription: Subscription;
  loginStateChanged: Subject<UserProfile> = new Subject<UserProfile>();

  constructor(private socialAuthService: SocialAuthService,
    private authService: AuthService) {

  }

  signIn(provider: string) {
    return this.signInByProvider(provider).then(socialUser => {
      if (socialUser) {
        const authToken = socialUser.authToken;

        // After the social login succeded, signout from the social service
        this.authService.socialLogin(provider, authToken).then(result => {
          this.socialAuthService.signOut().then(() => {
            this.loginStateChanged.next(result);
            this.socialAuthStateSubscription.unsubscribe();
          });
        }).catch(
          error => {
            this.loginStateChanged.error(error);
            this.socialAuthStateSubscription.unsubscribe();
          }
        );
      }
    }).catch(error => {
      console.error(error);
      this.loginStateChanged.error(error);
    });
  }

  private signInByProvider(provider: string) {
    switch (provider) {
      case 'google':
        return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      case 'facebook':
        return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }
}
