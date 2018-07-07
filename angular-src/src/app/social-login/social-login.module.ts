import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginModule as NgxSocialLogin, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { environment } from '../../environments/environment';

const config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.socialLogin.google)
  },
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(environment.socialLogin.facebook)
  }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  imports: [
    CommonModule,
    NgxSocialLogin
  ],
  declarations: [],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  exports: [
    NgxSocialLogin
  ]
})
export class SocialLoginModule { }
