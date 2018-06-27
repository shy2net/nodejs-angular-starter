import * as express from 'express';
import * as cors from 'cors';
import * as middlewares from './middlewares';

import config from '../config';
import controller from './controller';

const router = express.Router();

router.use(cors(config.CORS_OPTIONS));
router.use(middlewares.unhandledErrorMiddleware);
router.get('/test', (req: express.Request, res: express.Response) => {
    res.json(controller.test());
});

router.get('/error-test', (req: express.Request, res: express.Response) => {
    res.json(controller.errorTest());
});

module.exports = router;