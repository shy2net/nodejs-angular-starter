import { Observable, of, throwError } from 'rxjs';

import { Injectable } from '@angular/core';

import { LoginActionResponse, UserProfile } from '../../../../../shared/models';
import { generateMockRootUser } from '../../../../../shared/testing/mock/user.mock';

@Injectable()
export class MockApiService {
  // The root user
  rootUser: UserProfile = generateMockRootUser();

  // The list of users registered
  registeredUsers: UserProfile[] = [];

  login(username: string, password: string): Observable<LoginActionResponse> {
    if (username === 'admin' && password === 'admin') {
      return of({
        status: 'ok',
        data: {
          token: 'randomtoken',
          profile: this.rootUser,
        },
      });
    }

    // All other requests should return an error
    return throwError({
      status: 'error',
      error: 'Invalid username\\password entered!',
    });
  }

  socialLogin(): Observable<LoginActionResponse> {
    return throwError('Not implemented!');
  }

  register(user: UserProfile): Observable<UserProfile> {
    this.registeredUsers.push(user);
    return of(user);
  }

  getProfile(): Observable<UserProfile> {
    return of(this.rootUser);
  }
}
