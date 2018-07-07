import { Injectable } from '@angular/core';
import { AuthService as SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

@Injectable()
export class SocialLoginService {

  constructor(private socialAuthService: SocialAuthService) {
    this.registerAuthStateChanges();
  }

  registerAuthStateChanges() {
    this.socialAuthService.authState.subscribe(user => {
      console.log(user);

      if (user) {
        const authToken = user.authToken;

        // TODO: Send the authentication token back to the server
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
