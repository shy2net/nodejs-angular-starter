import { Component, OnInit } from '@angular/core';

import { SocialLoginService } from '../social-login.service';

@Component({
  selector: 'app-social-login-button',
  templateUrl: './social-login-button.component.html',
  styleUrls: ['./social-login-button.component.css']
})
export class SocialLoginButtonComponent implements OnInit {

  constructor(private socialLoginService: SocialLoginService) { }

  ngOnInit() {
  }

  onSocialLoginClick(provider: string) {
    return this.socialLoginService.signIn(provider);
  }
}
