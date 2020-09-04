import { AppRequest, AppResponse } from './models/app-req-res';

/**
 * Converts a middleware into a promise, for easier usage with tS.ED framework.
 * @param middlewareFunc
 * @param req
 * @param res
 */
export function middlewareToPromise(
  middlewareFunc: (req, res, next) => void,
  req: AppRequest,
  res?: AppResponse
): Promise<unknown> {
  return new Promise((resolve) => {
    middlewareFunc(req, res, (err) => {
      if (err) throw err;
      resolve();
    });
  });
}
