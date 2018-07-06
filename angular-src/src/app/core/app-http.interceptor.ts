import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import 'rxjs/add/operator/do';

import { ActionResponse } from '../../../../shared/models';
import { AuthService, ToastyHelperService } from './services';


export enum RequestState {
  started,
  ended
}

/**
 * This interceptor handles all of the ongoing requests.
 * It adds an authentication token if available in the auth-service. On any error that
 * occurs from a request, a toasty will show.
 */
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  onRequestStateChanged: Subject<RequestState> = new Subject<RequestState>();
  private requestsCount = 0;

  get isRequestLoading() {
    return this.requestsCount > 0;
  }

  constructor(public authService: AuthService,
    private toastyHelperService: ToastyHelperService) { }
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
    this.onRequestStarted();

    return request.do((event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        this.onRequestEnded();
      }
    }, (errorResponse) => {
      if (errorResponse instanceof HttpErrorResponse) {
        const errorBody = errorResponse.error as ActionResponse<any>;
        this.toastyHelperService.showError(`An error had occured`, errorBody.error);
        this.onRequestEnded();
      }
    });
  }

  onRequestStarted() {
    ++this.requestsCount;
    if (!this.isRequestLoading) {
      this.onRequestStateChanged.next(RequestState.started);
    }
  }

  onRequestEnded() {
    if (--this.requestsCount === 0) {
      this.onRequestStateChanged.next(RequestState.ended);
    }
  }
}
