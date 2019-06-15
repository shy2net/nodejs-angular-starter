import { Err, GlobalErrorHandlerMiddleware, OverrideProvider, Req, Res } from '@tsed/common';
import { ValidationError } from 'class-validator';
import { BadRequest } from 'ts-httpexceptions';
import { getFormValidationErrorText } from '../../shared/shared-utils';

/**
 * Overriding the global error handling allows us to throw invalid form error and handle them correctly.
 */
@OverrideProvider(GlobalErrorHandlerMiddleware)
export class ErrorHandlerMiddleware extends GlobalErrorHandlerMiddleware {
  use(@Err() error: any, @Req() request: Req, @Res() response: Res): any {
    if (error instanceof Array) {
      if (error.length > 0 && error[0] instanceof ValidationError)
        error = new BadRequest(getFormValidationErrorText(error));
    }

    return super.use(error, request, response);
  }
}
