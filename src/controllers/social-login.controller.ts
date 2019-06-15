import { BodyParams, Controller, Get, PathParams, Req, Res, Next } from '@tsed/common';
import * as passport from 'passport';

import { LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import * as responses from '../responses';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from 'ts-httpexceptions';
import { middlewareToPromise } from '../server-utils';

@Controller('/social-login')
export class SocialLoginController {
  @Get('/:provider')
  async socialLogin(
    @PathParams('provider') provider: string,
    @BodyParams() user: UserProfile,
    @Req() req?: Request,
    @Res() res?: Response
  ): Promise<LoginActionResponse> {
    // If this is not unit testing and we have obtained a request
    if (req) {
      // Wait for the passport middleware to run
      await middlewareToPromise(passport.authenticate(`${provider}-token`, { session: false }), req, res); // Authenticate using the provider suitable (google-token, facebook-token)
      user = req.user;
    }

    const token = auth.generateToken(user);
    return responses.getOkayResponse({
      token,
      profile: user
    });
  }
}
