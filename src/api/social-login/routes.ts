import * as express from 'express';
import * as passport from 'passport';

import { AppRequest, AppResponse } from '../../models';
import controller from './controller';

const router = express.Router();

const socialLoginMethod = (req: AppRequest, res: AppResponse, next: (data) => void) => {
  // Move the promise response to be handled by the postResponseMiddleware
  next(controller.socialLogin(req.user));
};

router.get('/facebook',
  passport.authenticate('facebook-token', { session: false }),
  socialLoginMethod);

router.get('/google',
  passport.authenticate('google-token', { session: false }),
  socialLoginMethod);

module.exports = router;
