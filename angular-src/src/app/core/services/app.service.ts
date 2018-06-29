import { HttpClient, RequestState } from './http.service';
import { Injectable } from '@angular/core';

import { UserProfile } from '../../../../../shared/models';

@Injectable()
export class AppService {
  user: UserProfile = null;
  loginChecked = false;
  isRequestLoading = false;

  constructor(private httpService: HttpClient) {
    // Detect when a request is currently ongoing
    this.httpService.onRequestStateChanged.subscribe(
      newState => (this.isRequestLoading = newState === RequestState.started)
    );
  }

  get isLoggedIn(): boolean {
    return this.user != null && this.loginChecked;
  }
}
