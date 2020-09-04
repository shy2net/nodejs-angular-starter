import { Observable } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ActionResponse, LoginActionResponse, UserProfile } from '../../../../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  constructor(private httpService: HttpClient) {}

  get serverUrl(): string {
    return environment.apiServer;
  }

  get apiUrl(): string {
    return `${this.serverUrl}/api`;
  }

  getApiEndpoint(endpoint: string): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  login(username: string, password: string): Observable<LoginActionResponse> {
    const url = this.getApiEndpoint(`login`);

    return this.httpService.post<LoginActionResponse>(url, {
      username,
      password
    });
  }

  socialLogin(provider: string, authToken: string): Observable<LoginActionResponse> {
    const url = this.getApiEndpoint(`social-login/${provider}`);
    return this.httpService.get<LoginActionResponse>(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        access_token: `${authToken}`
      },
      withCredentials: true
    });
  }

  register(user: UserProfile): Observable<UserProfile> {
    const url = this.getApiEndpoint('register/');
    return this.httpService.post<UserProfile>(url, user);
  }

  logout(): Observable<ActionResponse<null>> {
    const url = this.getApiEndpoint('logout/');
    return this.httpService.get<ActionResponse<null>>(url);
  }

  getProfile(): Observable<UserProfile> {
    const url = this.getApiEndpoint(`profile/`);
    return this.httpService.get<UserProfile>(url);
  }
}
