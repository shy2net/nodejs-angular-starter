import * as cors from 'cors';

import { IMiddleware, Middleware, Req, Res } from '@tsed/common';

import config from '../config';
import { AppRequest, AppResponse } from '../models';

/**
 * This middleware provides CORS middleware according to the cors library (https://www.npmjs.com/package/cors).
 */
@Middleware()
export class CorsMiddleware implements IMiddleware {
  public use(
    @Req() request: AppRequest,
    @Res() response: AppResponse
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      cors(config.CORS_OPTIONS)(request, response, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
