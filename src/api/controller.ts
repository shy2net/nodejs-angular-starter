import * as express from 'express';
import * as responses from './responses';
import config from '../config';

export function test(req: express.Request, res: express.Response) {
  responses.sendOk(res);
}
