import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';

@Injectable()
export class AppService {
  isRequestLoading = false;

  get user() {
    return this.authService.user;
  }

  get isLoggedIn(): boolean {
    return this.user != null && this.loginChecked;
  }

  get loginChecked() {
    return this.authService.loginChecked;
  }

  constructor(
    public authService: AuthService
  ) {

  }
}
