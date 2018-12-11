
import {tap} from 'rxjs/operators';
import { Injectable, Input } from '@angular/core';
import { Subject ,  Observable } from 'rxjs';
import {
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';

import { ToastrService } from 'ngx-toastr';
import { ActionResponse } from '../../../../../shared/models';

export enum RequestState {
  started,
  ended
}

/**
 * Handles all of the onging requests state, which allows us to detect wheter a request is currently happening in the background or not.
 * You can use this service to create an app request loading bar (in the header for example).
 */
@Injectable()
export class RequestsService {
  private requestsCount = 0;

  @Input()
  disableErrorToast = false;
  onRequestStateChanged: Subject<RequestState> = new Subject<RequestState>();

  get isRequestLoading() {
    return this.requestsCount > 0;
  }

  constructor(private toastService: ToastrService) {}

  onRequestStarted(request: Observable<HttpEvent<any>>) {
    // If we have detected that no previous request is running, emit and event that a request is ongoing now
    if (!this.isRequestLoading) {
      this.onRequestStateChanged.next(RequestState.started);
    }

    // Add the request to the count
    ++this.requestsCount;

    // Handle the request data obtained and show an error toast if nessecary
    return request.pipe(tap(
      (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.onRequestEnded();
        }
      },
      errorResponse => {
        if (errorResponse instanceof HttpErrorResponse) {
          if (!this.disableErrorToast) {
            const errorBody = errorResponse.error as ActionResponse<any>;
            this.toastService.error(
              `An error had occured`,
              errorBody.error
            );
          }

          this.onRequestEnded();
        }
      }
    ));
  }

  private onRequestEnded() {
    if (--this.requestsCount === 0) {
      this.onRequestStateChanged.next(RequestState.ended);
    }
  }
}
