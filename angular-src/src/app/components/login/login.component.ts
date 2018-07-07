import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService as SocialAuthService, SocialUser } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';

import { AuthService, ToastyHelperService } from './../../core/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private toastyService: ToastyHelperService
  ) { }

  ngOnInit() { }

  onSocialLoginClick(provider: string) {
    switch (provider) {
      case 'google':
        return this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
      case 'facebook':
        return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
    }
  }

  onLoginClick() {
    this.authService.login(this.username, this.password).subscribe(
      result => {
        this.toastyService.showSuccess(
          `Login successfully`,
          `You are now logged in`
        );

        this.router.navigateByUrl('/user');
      },
      error => { }
    );
  }
}
