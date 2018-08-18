import { Request, Response, NextFunction } from 'express';
import { HttpError } from 'http-errors';
import { AppRequest, AppResponse } from '../models';
import * as apiHelper from './api-helper';
import * as responses from './responses';

/**
 * Manages runtime errors the occured within a controller (async error occur in a promise are handled in the postErrorMiddleware).
 * @param req
 * @param res
 * @param next
 */
export function unhandledErrorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    next();
  } catch (error) {
    next(error instanceof Error ? error : new Error(error));
  }
}

/**
 * This middleware handles data obtained from responses that return either and error or a promise with data.
 * If none of the above return, it will throw an exception.
 * @param data
 * @param req
 * @param res
 * @param next
 */
export function postResponseMiddleware(
  data: any,
  req: AppRequest,
  res: AppResponse,
  next: NextFunction
) {
  if (data instanceof Error) {
    return next(data);
  } else if (data instanceof Promise) {
    return apiHelper.handlePromiseResponse(data, req, res, next);
  } else {
    throw new Error('Data is not recognized, please make sure the controller you use returns a promise or an error');
  }
}

/**
 * This middleware will handle the errors obtained from the postResponseMiddleware.
 * @param error
 * @param req
 * @param res
 * @param next
 */
export function postErrorMiddleware(
  error: any,
  req: AppRequest,
  res: AppResponse,
  next: NextFunction
) {
  if (error) {
    if (error instanceof HttpError) {
      return res
        .status(error.statusCode)
        .json(responses.getErrorResponse(error.message));
    }

    // An unknown error has occured
    console.error(error);
    return res.status(500).json(responses.getErrorResponse(error));
  }
}
