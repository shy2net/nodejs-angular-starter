import { Request, Response } from 'express';
import { HttpError } from 'http-errors';
import { AppRequest, AppResponse } from '../models/app-req-res';
import * as responses from './responses';

export function authenticationMiddleware() {

};

export function unhandledErrorMiddleware(req: Request, res: Response, next: () => void) {
    try {
        next();
    }
    catch (error) {
        if (error instanceof HttpError) {
            return res.status(error.statusCode).json(responses.getErrorResponse(error.message))
        }

        res.status(500).json(responses.getErrorResponse(error));
    }
};

export function postErrorMiddleware(req: AppRequest, res: AppResponse, next: () => void) {

};