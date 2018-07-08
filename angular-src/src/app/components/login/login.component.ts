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
  email: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private toastyService: ToastyHelperService
  ) { }

  ngOnInit() { }

  onLoginClick() {
    this.authService.login(this.email, this.password).subscribe(
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
