import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';

@Injectable()
export class AppService {
  user: UserProfile = null;
  loginChecked = false;
  isRequestLoading = false;

  constructor() {}

  get isLoggedIn(): boolean {
    return this.user != null && this.loginChecked;
  }
}
