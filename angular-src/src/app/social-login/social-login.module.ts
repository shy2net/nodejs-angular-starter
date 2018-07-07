import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialLoginModule as NgxSocialLogin, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

import { environment } from '../../environments/environment';
import { SocialLoginService } from './social-login.service';
import { SocialLoginButtonComponent } from './social-login-button/social-login-button.component';

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
  declarations: [SocialLoginButtonComponent],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    },
    SocialLoginService
  ],
  exports: [
    NgxSocialLogin,
    SocialLoginButtonComponent
  ]
})
export class SocialLoginModule { }
