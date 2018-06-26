import * as express from 'express';
import * as cors from 'cors';

import config from '../config';
import * as controller from './controller';

const router = express.Router();

router.use(cors(config.CORS_OPTIONS));
router.get('/test', controller.test);

module.exports = router;
