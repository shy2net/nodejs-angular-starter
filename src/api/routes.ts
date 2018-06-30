import * as express from 'express';
import * as cors from 'cors';

import * as middlewares from './middlewares';
import * as apiHelper from './api-helper';
import { AppRequest, AppResponse } from '../models';
import config from '../config';
import controller from './controller';
import { RegisterForm } from './forms';

const router = express.Router();

router.use(cors(config.CORS_OPTIONS));
router.use(middlewares.unhandledErrorMiddleware);
router.get(
  '/test',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.test());
  }
);

router.get(
  '/error-test',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Move the error returned from the promise to be handled by the postResponseMiddleware
    next(controller.errorTest());
  }
);

router.get(
  '/say-something',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    // Ready the url param say
    const whatToSay = req.param('what') as string;

    // Move the promise response to be handled by the postResponseMiddleware
    next(controller.saySomething(whatToSay));
  }
);

router.get(
  '/login',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    const loginForm: { username: string; password: string } = req.body;
    next(controller.login(loginForm.username, loginForm.password));
  }
);

router.get(
  '/profile',
  middlewares.authenticationMiddleware,
  (req: AppRequest, res: AppResponse, next: (data) => void) => {
    next(controller.getProfile(req.user));
  }
);

router.get(
  '/logout',
  middlewares.authenticationMiddleware,
  (req: AppRequest, res: AppResponse, next: (data) => void) => {
    next(controller.logout());
  }
);

router.post(
  '/register',
  (req: express.Request, res: express.Response, next: (data) => void) => {
    const registerForm = req.body as RegisterForm;
    next(controller.register(registerForm));
  }
);

router.use(middlewares.postResponseMiddleware);
router.use(middlewares.postErrorMiddleware);

module.exports = router;
