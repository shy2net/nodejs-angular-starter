import { Injectable, Inject } from '@angular/core';

import 'rxjs/add/operator/map';
import { UserProfile, ActionResponse, LoginActionResponse } from '../../../../../shared/models';
import { HttpClient } from '../services/http.service';
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
      `login/?username=${username}&password=${password}`
    );

    return this.httpService
      .post(url, null)
      .map(response => response.json() as LoginActionResponse);
  }

  logout() {
    const url = this.getApiEndpoint('logout/');
    return this.httpService
      .get(url)
      .map(response => response.json() as ActionResponse<null>);
  }

  getProfile(disableErrorToast?: boolean) {
    const url = this.getApiEndpoint(`profile/`);
    return this.httpService
      .get(url, null, disableErrorToast)
      .map(response => response.json() as UserProfile);
  }
}
