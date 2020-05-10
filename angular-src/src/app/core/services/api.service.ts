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

  getApiEndpoint(endpoint): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  login(username: string, password: string) {
    const url = this.getApiEndpoint(`login`);

    return this.httpService.post<LoginActionResponse>(url, {
      username,
      password
    });
  }

  socialLogin(provider: string, authToken: string) {
    const url = this.getApiEndpoint(`social-login/${provider}`);
    return this.httpService.get<LoginActionResponse>(url, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        access_token: `${authToken}`
      },
      withCredentials: true
    });
  }

  register(user: UserProfile) {
    const url = this.getApiEndpoint('register/');
    return this.httpService.post<UserProfile>(url, user);
  }

  logout() {
    const url = this.getApiEndpoint('logout/');
    return this.httpService.get<ActionResponse<null>>(url);
  }

  getProfile() {
    const url = this.getApiEndpoint(`profile/`);
    return this.httpService.get<UserProfile>(url);
  }
}
