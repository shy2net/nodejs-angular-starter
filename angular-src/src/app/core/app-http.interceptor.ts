import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService, RequestsService } from '@services';

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
    // Add our authentication token if existing
    if (this.authService.hasCredentials) {

      // Check if this request does already contains a credentails to send, if so, don't append our token
      if (!request.withCredentials) {
        const cloneOptions = {
          setHeaders: {
            Authorization: `Bearer ${this.authService.savedToken}`
          }
        };

        request = request.clone(cloneOptions);
      }
    }

    return this.handleRequest(next.handle(request));
  }

  handleRequest(request: Observable<HttpEvent<any>>) {
    return this.requestsService.onRequestStarted(request);
  }
}
