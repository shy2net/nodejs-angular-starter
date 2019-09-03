import { Request, Response } from 'express';
import * as passport from 'passport';

import { AppRequest, AppResponse } from '@models';
import { BodyParams, Controller, Get, PathParams, Req, Res } from '@tsed/common';

import { LoginActionResponse, UserProfile } from '../../shared/models';
import auth from '../auth';
import * as responses from '../responses';
import { middlewareToPromise } from '../server-utils';

@Controller('/social-login')
export class SocialLoginController {
  @Get('/:provider')
  async socialLogin(
    @PathParams('provider') provider: string,
    @BodyParams() user: UserProfile,
    @Req() req?: AppRequest,
    @Res() res?: AppResponse
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
