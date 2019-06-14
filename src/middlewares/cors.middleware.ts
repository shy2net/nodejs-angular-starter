import * as cors from 'cors';

import { IMiddleware, Middleware, Req, Res } from '@tsed/common';

import config from '../config';
import { AppRequest, AppResponse } from '../models';

@Middleware()
export class CorsMiddleware implements IMiddleware {
  public use(@Req() request: AppRequest, @Res() response: AppResponse) {
    return new Promise((resolve, reject) => {
      cors(config.CORS_OPTIONS)(request, response, err => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
}
