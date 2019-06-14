import { BodyParams, Controller, Get, PathParams, Req, Res, Next } from '@tsed/common';
import * as passport from 'passport';

import { LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import * as responses from '../responses';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from 'ts-httpexceptions';

@Controller('/social-login')
export class SocialLoginController {
  @Get('/:provider')
  async socialLogin(
    @PathParams('provider') provider: string,
    @BodyParams() user: UserProfile,
    @Req() req?: Request,
    @Res() res?: Response
  ): Promise<LoginActionResponse> {
    if (req) {
      // TODO: Use promisify
      await new Promise((resolve, reject) => {
        passport.authenticate(`${provider}-token`, { session: false })(req, res, err => {
          if (err) throw new BadRequest(err);
          user = req.user;
          resolve();
        });
      });
    }

    const token = auth.generateToken(user);
    return responses.getOkayResponse({
      token,
      profile: user
    });
  }
}
