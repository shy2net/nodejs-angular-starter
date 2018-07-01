import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject } from 'rxjs';
import 'rxjs/operators/map';

import { ApiService } from './api.service';
import { UserProfile, ActionResponse } from '../../../../../shared/models';

@Injectable()
export class AuthService {
  loginObservable: Observable<UserProfile>;
  _user: UserProfile;
  userChanged: Subject<UserProfile> = new Subject<UserProfile>();
  private _loginChecked: boolean;

  get user(): UserProfile {
    return this._user;
  }

  set user(user: UserProfile) {
    this._user = user;
  }

  get loginChecked() {
    return this._loginChecked;
  }

  set loginChecked(loginChecked: boolean) {
    this.loginChecked = loginChecked;
  }

  get hasCredentails() {
    return this.cookieService.get('auth_token');
  }

  get isLoggedIn() {
    return this.hasCredentails && this.isLoggedIn;
  }

  get isLoggedInAsync() {
    if (!this.hasCredentails) {
      return false;
    }

    if (!this.loginChecked) {
      return this.loginObservable.map(userProfile => userProfile != null);
    }

    return this.isLoggedIn;
  }

  constructor(
    private apiService: ApiService,
    private cookieService: CookieService
  ) { }

  checkLogin(): void {
    if (!this.hasCredentails) {
      this.loginChecked = true;
      return;
    }

    this.loginChecked = false;
    this.loginObservable = this.apiService.getProfile(true);
    this.loginObservable.subscribe(
      response => {
        this.user = response;
        this.loginChecked = true;
      },
      error => {
        this.loginChecked = true;
      }
    );
  }

  login(email: string, password: string) {
    const observable = this.apiService.login(email, password);
    observable.subscribe(
      result => {
        this.cookieService.put(`auth_token`, result.data.token);
        this.user = result.data.profile;
      },
      error => {
        alert(`Failed to login with error: ${error}`);
        console.error(error);
      }
    );

    return observable;
  }

  logout() {
    this.loginChecked = false;
    this.apiService.logout().subscribe(
      response => {
        this.user = null;
        this.cookieService.remove('auth_token');
        this.loginChecked = true;
      },
      error => {
        this.loginChecked = true;
        console.error(error);
      }
    );
  }
}
