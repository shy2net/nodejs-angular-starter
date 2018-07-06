import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import 'rxjs/add/operator/do';

import { AuthService, RequestsService } from './services';

/**
 * This interceptor handles all of the ongoing requests.
 * It adds an authentication token if available in the auth-service.
 * All of the ongoing requests are passed to the requests-service to handle and show an error if required.
 */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  constructor(public authService: AuthService,
    private requestsService: RequestsService) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.hasCredentails) {
      const cloneOptions = {
        setHeaders: {
          Authorization: `Bearer ${this.authService.savedToken}`
        }
      };

      request = request.clone(cloneOptions);
    }

    return this.handleRequest(next.handle(request));
  }

  handleRequest(request: Observable<HttpEvent<any>>) {
    return this.requestsService.onRequestStarted(request);
  }
}
