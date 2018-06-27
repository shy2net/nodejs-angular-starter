import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable } from 'rxjs';
import 'rxjs/operators/map';

import { AppService } from './app.service';
import { ApiService } from './api.service';
import { UserProfile, ActionResponse } from '../../../../../shared/models';

@Injectable()
export class AuthService {
  loginObservable: Observable<UserProfile>;

  get hasCredentails() {
    return this.cookieService.get('auth_token');
  }

  get isLoggedIn() {
    return this.hasCredentails && this.appService.isLoggedIn;
  }

  get isLoggedInAsync() {
    if (!this.hasCredentails) {
      return false;
    }

    if (!this.appService.loginChecked) {
      return this.loginObservable.map(userProfile => userProfile != null);
    }

    return this.isLoggedIn;
  }

  constructor(
    private appService: AppService,
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  checkLogin(): void {
    if (!this.hasCredentails) {
      this.appService.loginChecked = true;
      return;
    }

    this.appService.loginChecked = false;
    this.loginObservable = this.apiService.getProfile(true);
    this.loginObservable.subscribe(
      response => {
        this.appService.user = response;
        this.appService.loginChecked = true;
      },
      error => {
        this.appService.loginChecked = true;
      }
    );
  }

  login(email: string, password: string) {
    const observable = this.apiService.login(email, password);
    observable.subscribe(
      result => {
        this.cookieService.put(`auth_token`, result.token);
        this.appService.user = result.profile;
      },
      error => {
        alert(`Failed to login with error: ${error}`);
        console.error(error);
      }
    );

    return observable;
  }

  logout() {
    this.appService.loginChecked = false;
    this.apiService.logout().subscribe(
      response => {
        this.appService.user = null;
        this.cookieService.remove('auth_token');
        this.appService.loginChecked = true;
      },
      error => {
        this.appService.loginChecked = true;
        console.error(error);
      }
    );
  }
}
