import { Injectable } from '@angular/core';
import {
  UserProfile,
  ActionResponse,
  LoginActionResponse
} from '../../../../../shared/models';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable()
export class ApiService {
  constructor(
    private httpService: HttpClient
  ) { }

  get serverUrl(): string {
    return environment.apiServer;
  }

  get apiUrl(): string {
    return `${this.serverUrl}/api`;
  }

  getApiEndpoint(endpoint): string {
    return `${this.apiUrl}/${endpoint}`;
  }

  getFromEndpoint(endpoint: string) {
    return this.httpService.get(this.getApiEndpoint(endpoint));
  }

  postFromEndpoint(endpoint: string, data) {
    return this.httpService.post(this.getApiEndpoint(endpoint), data);
  }

  login(username, password) {
    const url = this.getApiEndpoint(
      `login`
    );

    return this.httpService
      .post<LoginActionResponse>(url, {
        username,
        password
      });
  }

  socialLogin(provider: string, authToken: string) {
    const url = this.getApiEndpoint(`social-login/${provider}`);
    return this.httpService.get<LoginActionResponse>(url, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      withCredentials: true
    });
  }

  logout() {
    const url = this.getApiEndpoint('logout/');
    return this.httpService
      .get<ActionResponse<null>>(url);
  }

  getProfile() {
    const url = this.getApiEndpoint(`profile/`);
    return this.httpService
      .get<UserProfile>(url);
  }
}
