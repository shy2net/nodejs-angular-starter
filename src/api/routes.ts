import * as express from 'express';
import * as cors from 'cors';
import * as middlewares from './middlewares';
import * as apiHelper from './api-helper';

import config from '../config';
import controller from './controller';

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

router.use(middlewares.postResponseMiddleware);
router.use(middlewares.postErrorMiddleware);

module.exports = router;
