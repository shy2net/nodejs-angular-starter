import * as express from 'express';
import * as cors from 'cors';

import config from '../config';
import controller from './controller';

const router = express.Router();

router.use(cors(config.CORS_OPTIONS));
router.get('/test', (req: express.Request, res: express.Response) => {
    res.json(controller.test());
});

module.exports = router;