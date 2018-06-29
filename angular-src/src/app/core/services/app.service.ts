import { AuthService } from './auth.service';
import { HttpClient, RequestState } from './http.service';
import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';

@Injectable()
export class AppService {
  isRequestLoading = false;

  get user() {
    return this.authService.user;
  }

  get loginChecked() {
    return this.authService.loginChecked;
  }

  constructor(
    private httpService: HttpClient,
    private authService: AuthService
  ) {
    // Detect when a request is currently ongoing
    this.httpService.onRequestStateChanged.subscribe(
      newState => (this.isRequestLoading = newState === RequestState.started)
    );
  }

  get isLoggedIn(): boolean {
    return this.user != null && this.loginChecked;
  }
}
