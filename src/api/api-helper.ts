import { Request, Response } from 'express';

// Future use maybe
export function getHandleRequest(
  controllerFunction: (...params) => Promise<any>,
  ...params
) {
  return (req: Request, res: Response, next: (error) => void) => {
    const promiseResponse = controllerFunction(params);
    return handlePromiseResponse(promiseResponse, req, res, next);
  };
}

/**
 * Handles a promise obtained from a controller.
 * @param promise
 * @param req
 * @param res
 * @param next
 */
export function handlePromiseResponse(
  promise: Promise<any>,
  req: Request,
  res: Response,
  next?: (error: any) => void
) {
  promise
    .then(data => {
      res.json(data);
    })
    .catch((error: any) => {
      next && next(error instanceof Error ? error : new Error(error));
    });
}
